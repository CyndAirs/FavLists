var express = require('express');
var router = express.Router();
var categoryService = require('../services/category.service');

// routes
router.post('/', add);
router.get('/:user', getAll);
router.delete('/:_id', _delete);

module.exports = router;

function add(req, res) {
    categoryService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    categoryService.getAll(req.params.user)
        .then(function (categories) {
            res.send(categories);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    categoryService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}