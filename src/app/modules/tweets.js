var express = require('express'),
	TweetModel = require('../models/tweet'),
	router = express.Router();

router.route('/')
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

router.route('/:tweet_id')
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
	).put(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.status(200).json(req.body);
		}
	).delete(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			res.status(200).json(['OK']);
		}
	);

module.exports = router;