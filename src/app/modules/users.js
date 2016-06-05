var express    = require('express'),
	config     = require('../config.dev'),
	twitter    = require('twitter'),
	UserModel  = require('../models/user'),
	TweetModel = require('../models/tweet'),
    router     = express.Router();

router.route('/')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.status(404).json({error: "not allowed"});
		}
	);

router.route('/:user_id')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Update the model, check that it's owned by the user
			// and if so, return it to the user.
			console.log(req.session.passport.user, parseInt(req.params.user_id, 10));
			if (req.session.passport.user === parseInt(req.params.user_id, 10)) {
				UserModel.find(
					{"twitter.id": req.params.user_id},
					function (err, item) {
						if (err) {
							res.send(err);
						} else {
							res.json(item.twitter);
						}
					}
				);
			} else {
				res.status(403).json([]);
			}
		}
	);

router.route('/:user_id/timeline')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Update the model, check that it's owned by the user
			// and if so, return it to the user.
			console.log(req.session.passport.user, parseInt(req.params.user_id, 10));
			if (req.session.passport.user === parseInt(req.params.user_id, 10)) {
				UserModel.find(
					{"twitter.id": req.params.user_id},
					function (err, user) {
						user = user[0];
						console.log(user);
						if (err) {
							res.send(err);
						} else {
							var client = new twitter({
								consumer_key: config.auth.twitter.consumerKey,
								consumer_secret: config.auth.twitter.consumerSecret,
								access_token_key: user.twitter.token,
								access_token_secret:  user.twitter.tokenSecret
							});

							client.get(
								'statuses/user_timeline',
								{screen_name: user.twitter.username},
								function (error, tweets, response) {
									if (!error) {
										for (var t = 0; t <= tweets.length; t += 1) {
											var tm = new TweetModel(tweets[t]);
											tm.owner = req.session.passport.user;
											tm.save();
										}
										res.json(tweets);
									}
								}
							);
						}
					}
				);
			} else {
				res.status(403).json([]);
			}
		}
	);

router.route('/:user_id/search')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// Update the model, check that it's owned by the user
			// and if so, return it to the user.
			console.log(req.session.passport.user, parseInt(req.params.user_id, 10));
			if (req.session.passport.user === parseInt(req.params.user_id, 10)) {
				UserModel.find(
					{"twitter.id": req.params.user_id},
					function (err, user) {
						user = user[0];
						console.log(user);
						if (err) {
							res.send(err);
						} else {
							var client = new twitter({
								consumer_key: config.auth.twitter.consumerKey,
								consumer_secret: config.auth.twitter.consumerSecret,
								access_token_key: user.twitter.token,
								access_token_secret:  user.twitter.tokenSecret
							});

							client.get(
								'search/tweets',
								{q: req.param('q')},
								function (error, tweets, response) {
									if (!error) {
										for (var t = 0; t <= tweets.statuses.length; t += 1) {
											var tm = new TweetModel(tweets.statuses[t]);
											tm.owner = req.session.passport.user;
											tm.save();
										}
									}
									res.json(tweets.statuses);
								}
							);
						}
					}
				);
			} else {
				res.status(403).json([]);
			}
		}
	);

module.exports = router;