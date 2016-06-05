var express = require('express'),
	UserModel    = require('../models/user'),
	passport = require('./passport'),
	TopicModel    = require('../models/topic'),
    router = express.Router();

router.route('/')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			console.log(req.user);
			return TopicModel
			   	.find(
			   		{
			   			uid: req.user._id
			   		},
    				function(err, rows) {
    					res.status(200).send(rows);
	    		 	}
		    	);
		}
	).post(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			/**
			 * uid = current user
			 * languages = [en, es, ca, fr, de]
			 * seedSources = [timeline, search]
			**/
			console.log(req);
			var item = new TopicModel({
				uid: req.user._id,
				title: req.body.title,
				timelineCount: parseInt(req.body.timelineCount, 10) || 100,
				search: req.body.search || '',
				languages: req.body.languages || [],
				seedSources: req.body.seedSources || ['timeline', 'search']
			});

			item.save(
				function (err) {
					if (err) {
						res.send(err);
					}
					res.status(200).json(item);
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
			require('connect-ensure-login').ensureLoggedIn();
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
			//XXX Fails to update:
			//{"name":"MongoError","err":"Mod on _id not allowed","code":10148,"n":0,"connectionId":413,"ok":1}
			require('connect-ensure-login').ensureLoggedIn();
			TopicModel.findById(
				req.params.topic_id,
				function (err, item) {
					if (err || !item || !item._id) {
						res.send(err);
					} else {
						// console.log(item);
						for (k in item) {
							// console.log(k, req.body[k]);
							if (item.hasOwnProperty(k) && req.body[k] && k !== '_id') {
								item[k] = req.body[k];
							}
						}
						delete item._id;
						item.update(
							function (err, item) {
								if (err) {
									res.send(err);
								}
								res.json(item);
							}
						);
					}
				}
			);
		}
	).delete(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Find the item, checks that it's owned by the user
			// and if so, removes it.
			TopicModel
				.findById(
					req.params.topic_id,
					function (err, item) {
						passport.deserializeUser(
							function(id, done) {
								if (item.uid !== id) {
									res.status(403).send({error: "The current user is not the owner of such resource"});
								}
								done(null, {});
							}
						);

					}
				)
				.remove(
					function (err, item) {
						if (err) {
							res.status(500).send(err);
						}
						res.json({});
					}
				);
		}
	);

module.exports = router;