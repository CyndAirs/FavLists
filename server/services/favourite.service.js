var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/FavDb", { native_parser: true });
db.bind('favourites');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;

module.exports = service;

function getAll(user, category) {
    var deferred = Q.defer();

    db.favourites.find({"user":user, "category":category}).toArray(function (err, favourites) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return favourites (without hashed passwords)
        favourites = _.map(favourites);

        deferred.resolve(favourites);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.favourites.findById(_id, function (err, favourite) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (favourite) {
            // return favourite (without hashed password)
            deferred.resolve(_.omit(favourite, 'hash'));
        } else {
            // favourite not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(favouriteParams) {
    var deferred = Q.defer();

    newFavourite =  _.omit(favouriteParams, '_id', 'rank');
    newFavourite.rank = parseInt(favouriteParams.rank, 10);

    db.favourites.findOne(
        {  
            user : newFavourite.user,
            category: newFavourite.category, 
            title: newFavourite.title 
        },
        function (err, fav) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (fav) {
                // username already exists
                deferred.reject('Title "' + newFavourite.title + '" is already on the list');
            } else {
                db.favourites.insert(
                    newFavourite,
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
            
                        db.favourites.find(
                            { 
                                user : newFavourite.user, 
                                category: newFavourite.category, 
                                rank: { $gte: newFavourite.rank },
                                title: { $ne: newFavourite.title } 
                            }).toArray(function (err, favourites) {
                                if (err) deferred.reject(err.name + ': ' + err.message);
                                else{
                                    favourites = _.map(favourites);
                                    for(var favourite of favourites){
                                        let oldRank = favourite.rank;
                                        var set = {
                                            rank: oldRank + 1,
                                        };
                                        db.favourites.update(
                                            { _id: mongo.helper.toObjectID(favourite._id) },
                                            { $set: set },
                                            function (err, doc) {
                                                if (err) deferred.reject(err.name + ': ' + err.message);
                                
                                                deferred.resolve();
                                            });
                                    }
                                }
                            });
            
                        deferred.resolve();
                    });
            }
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.favourites.findOne(
        { _id: mongo.helper.toObjectID(_id) },
        function (err, fav) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            db.favourites.find(
                { 
                    user : fav.user, 
                    category: fav.category, 
                    rank: { $gt: fav.rank }
                }).toArray(function (err, favourites) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    else{
                        favourites = _.map(favourites);
                        for(var favourite of favourites){
                            let oldRank = favourite.rank;
                            var set = {
                                rank: oldRank - 1,
                            };
                            db.favourites.update(
                                { _id: mongo.helper.toObjectID(favourite._id) },
                                { $set: set },
                                function (err, doc) {
                                    if (err) deferred.reject(err.name + ': ' + err.message);
                    
                                    deferred.resolve();
                                });
                        }
                    }
                });

            deferred.resolve();

            deferred.resolve();
        });


    db.favourites.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}