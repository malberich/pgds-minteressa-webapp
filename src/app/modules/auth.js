
var express = require('express'),
	passport   = require('./passport'),
	config = require('../config.' + (process.env.context || 'dev') + '.js'),
	UserModel     = require('../models/user'),
    router = express.Router();

if (config.auth.twitter) {

	router.route('/twitter')
		.get(
			passport.authenticate('twitter'),
			function(req, res){
				/*
					No need to do anything here.
					The user is redirected to twitter and afterwards
					it's redirected to /twitter/callback and so on.
				*/
			}
		);

	router.route('/twitter/callback')
		.get(
			passport.authenticate(
				'twitter',
				{
			    	failureRedirect : '/index.dev.html#/login'
			    }
		    ),
		    function(req, res) {
	    		res.redirect('/index.dev.html#/');
	    	}
	    );
}

module.exports = router;