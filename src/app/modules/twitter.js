var express = require('express'),
    passport   = require('./passport'),
    ensurelogin = require('connect-ensure-login'),
    SessionModel  = require('../models/session'),
    router = express.Router();

router.route('/')
    .get(
        function (req, res) {
            if (req.session) {
                res.json([req.session]);
            } else {
                res.status(401).json({});
            }
        }
    ).delete(
        ensurelogin.ensureLoggedIn(),
        function (req, res) {
            req.logout();
            res.status(200).send("OK");
        }
    );

router.route('/:session_id')
    .get(
        ensurelogin.ensureLoggedIn(),
        function (req, res) {
            res.json([req.session]);
        }
    ).delete(
        ensurelogin.ensureLoggedIn(),
        function (req, res) {
            req.logout();
            res.send("OK");
        }
    );

module.exports = router;