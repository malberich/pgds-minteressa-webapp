var mongoose  = require('mongoose'),
	Schema    = mongoose.Schema,

	UserModel = require('./user'),

	SessionSchema   = new Schema({
	    uid: {
	    	type: Schema.ObjectId,
	    	ref: UserModel
	    },
	    started: Number,
	    ttl: Number
	});

module.exports = mongoose.model('Session', SessionSchema);