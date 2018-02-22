var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/FavDb", { native_parser: true });
db.bind('categories');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;

module.exports = service;

function getAll(user, category) {
    var deferred = Q.defer();

    db.categories.find({"user":user}).toArray(function (err, categories) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return favourites (without hashed passwords)
        categories = _.map(categories);

        deferred.resolve(categories);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.categories.findById(_id, function (err, category) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (categories) {
            // return favourite (without hashed password)
            deferred.resolve(_.omit(favourite, 'hash'));
        } else {
            // favourite not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(categoryParam) {
    var deferred = Q.defer();

    newCategory =  _.omit(categoryParam, '_id');

    db.categories.findOne(
        { 
            name: newCategory.name,
            user: newCategory.user 
        },
        function (err, category) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (category) {
                // username already exists
                deferred.reject('Category "' + newCategory.name + '" already exists');
            } else {
                db.categories.insert(
                    newCategory,
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                    });
            }
            deferred.resolve();
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    db.categories.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}