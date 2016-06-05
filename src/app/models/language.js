var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema,
	LanguageSchema   = new Schema({
	    label: String,
	    isocode: String
	});


module.exports = mongoose.model('Language', LanguageSchema);