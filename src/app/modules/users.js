var express    = require('express'),
	config     = require('../config.dev'),
	twitter    = require('twitter'),
	UserModel  = require('../models/user'),
	TweetModel = require('../models/tweet'),
    // kafka  = require('node-kafka/lib/kafka'),
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
								'statuses/home_timeline',
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
								{q: req.param('q'), count: 100, },
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


router.route('/:user_id/tweets/')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			reviewFilter = (
				req.param('review') ?
				{review: req.query.review} :
				{}
			);
			console.log(reviewFilter);
			//TODO Should fetch data for this topic fetched from the processed store
			return TweetModel
				.find(reviewFilter)
				.then(
			   		function(err, rows) {
			        	res.json(rows);
			    	}
		    	);
		}
	).post(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.status(403).json({error: "Cannot create tweets"});
		}
	);

router.route('/:user_id/tweets/:tweet_id')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			TweetModel
				.find()
				.then(
			   		function(err, rows) {
			        	res.send(rows);
			    	}
		    	);
			res.status(200).send({data: []});
		}
	)/*.put(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.status(200).json(req.body);
		}
	)*/.delete(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.status(200).json(['OK']);
		}
	);


router.route('/:user_id/tweets/:tweet_id/:action')
	.put(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			// var producer = new kafka.Producer({
			// 	  brokers: "kafka:2181",
			// 	  partition: 0,
			// 	  topic: "topic-1234"
			// 	}),
			// 	tweet = req.body;
			// console.log(tweet);
			// producer.connect(
			// 	function() {
			// 	  producer.send(
			// 	  	JSON.stringify(tweets),
			// 	  	// 0,
			// 	  	function(err) {
			// 	    	console.log(err)
			// 	  	}
			// 	  )/*.on(
			// 	  	"sent",
			// 	  	function(err) {
			// 	    	console.log(err)
			// 	  	}
			// 	  ).on(
			// 	  	"delivery",
			// 	  	function(err, length) {
			// 	    	console.log(err, length)
			// 	  	}
			// 	  )*/.on(
			// 	  	"error",
			// 	  	function(err) {
			// 	    	console.log(err)
			// 	  	}
			// 	  );
			// 	}
			// );

			// producer.send(
   // 				[
   // 					{
   // 						topic: 'topic-' + req.query['user_id'] + 'labeled',
   // 						messages: tweet
   // 					}
			// 	]
			// );
			
			// if (JSON.parse(tweet).minteressa.selected === true) {
			// 	TweetModel
			// 		.save(tweet)
			// 		.then(
			// 	   		function(err, tweet) {
			// 	    	}
			//     	);
			// }	
			res.status(200).json({data:[]});
		}
	);


module.exports = router;