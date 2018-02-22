var express = require('express');
var router = express.Router();
var favouriteService = require('../services/favourite.service');

// routes
router.post('/', add);
router.get('/:user/:category', getAll);
router.delete('/:_id', _delete);

module.exports = router;

function add(req, res) {
    favouriteService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    favouriteService.getAll(req.params.user, req.params.category)
        .then(function (favourites) {
            res.send(favourites);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    favouriteService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}