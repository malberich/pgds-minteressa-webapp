var express = require('express'),
	LanguageModel    = require('../models/language'),
    router = express.Router();

router.route('/')
	.get(
		require('connect-ensure-login').ensureLoggedIn(),
		function (req, res) {
			LanguageModel
				.find()
				.then(
			   		function(err, rows) {
			        	res.send(rows);
			    	}
		    	);
		}
	);

module.exports = router;