var express = require('express'),
	passport   = require('./passport'),
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
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			req.logout();
			res.status(200).send("OK");
		}
	);

router.route('/:session_id')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.json([req.session]);
		}
	).delete(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			req.logout();
			res.send("OK");
		}
	);

module.exports = router;