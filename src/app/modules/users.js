var express    = require('express'),
	config     = require('../config.dev'),
	twitter    = require('twitter'),
	UserModel  = require('../models/user'),
	TweetModel = require('../models/tweet'),
    router = express.Router(),
	kafka = require('kafka-node'),
	client = new kafka.Client('kafka:2181'),
	producer = new kafka.Producer(client),
	consumer;

producer.on(
	'ready',
	function () {
		producer.createTopics(
			['labeled-1234', 'label-request-1234'],
			false,
			function (err, data) {
				if (!err) {
					consumer = new kafka.Consumer(
						client,
						[
							{topic: 'raw_tweets'}
						]
					);
					consumer.pause();
				} else {
					console.log(err);
				}
			}
		);

	}
);




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
								{q: req.query['q'], count: 100, },
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
				req.query['review'] ?
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

router.route('/:user_id/tweets/saved')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			///XXX Should check that user-id is the currently authenticated user
			return UserModel
				.findById(req.query['user_id'])
				.then(
			   		function(err, rows) {
			        	res.json(rows[0].tweets);
			    	}
		    	);
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
			var tweet = req.body,
				tweet_action = req.query['action'],
				uid = req.query['user_id'];

			if (!tweet.minteressa) {
				tweet.minteressa = {}
			}
			tweet.minteressa.selected = (/save/).test(tweet_action)
			   						? true
			   						: false;

			if ((/zzzz/).test(req.query['tweet_id'])) {
				return UserModel
					.findById(uid)
					.then(
				   		function(err, user) {
				   			user.topic.status = 2;
				   			user.save();
				    	}
			    	);
			}
			//XXX Unique topic for everybody, only for demo purposes
			producer.createTopics(
				['labeled-1234'/* + uid*/],
				false,
				function (err, data) {
					if (!err) {
			      		producer.send(
				      		[
				      			{
					      			topic: 'labeled-' + uid,
					      			messages: [JSON.stringify(data)],
					      			attributes: 1
						      	}
						    ],
				      		function (err, data) {
				      			if (err) {
				      				console.error("Error", err, data);
				      			} else {
				      				console.log("enqueued tweet");
				      				if(tweet.minteressa.selected === true) {
		      							return UserModel
		      								.findById(uid)
		      								.then(
		      							   		function(err, user) {
		      							   			user.topic.tweets.push(tweet);
		      							    	}
		      						    	);
				      				}
				      				res.status(200).json({data: [tweet]});
				      			}
				      		}
		      			)
					}
				}
			);
			// res.status(200).json(req.body);
		}
	);

router.route('/:user_id/tweets/label_request')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {

			consumer.on(
				'message',
				function (msg) {
					console.log(msg);
					consumer.commit();
					consumer.pause();
					res.status(200).json(msg);
				}
			);
			consumer.resume();
		}
	);

module.exports = router;