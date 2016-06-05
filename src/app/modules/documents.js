var express = require('express'),
	DocumentModel    = require('../models/document'),
    router = express.Router();

router.route('/')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			DocumentModel
				.find()
				.then(
			   		function(err, rows) {
			        	res.send(rows);
			    	}
		    	);
		}
	).post(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			/*
				seedSources = [timeline, search]
			*/
			var item = new DocumentModel({
				uid: "1234",
				title: req.title,
				search: req.search,
				languages: req.languages,
				seedSources: req.seedSources
			});

			item.save(
				function (err) {
					if (err) {
						return handleError(err);
					}
					res.json(item);
				}
			);
		}
	);

router.route('/:topic_id')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Update the model, check that it's owned by the user
			// and if so, return it to the user.
			TopicModel.findById(
				req.params.topic_id,
				function (err, item) {
					if (err) {
						res.send(err);
					} else {
						res.json(item);
					}
				}
			);
		}
	).put(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Update the model, check that it's owned by the user
			// and if so, update it.
			TopicModel.findById(
				req.params.topic_id,
				function (err, item) {
					if (err) {
						res.send(err);
					}
					res.send(item);
				}
			);
		}
	).delete(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Find the item, checks that it's owned by the user
			// and if so, removes it.
		}
	);

module.exports = router;