var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema,
	DocumentSchema   = new Schema({
	    _id: Schema.ObjectId,
	    type: String,
	    url: String,
	    text: String
	});


module.exports = mongoose.model('Document', DocumentSchema);