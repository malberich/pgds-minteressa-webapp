var mongoose     = require('mongoose'),
	// mongoosePaginate = require('mongoose-paginate'),
    Schema       = mongoose.Schema,
	LanguageModel = require('./language'),
	UserModel = require('./user'),

    TopicSchema   = new Schema({
        uid: {
        	type: Schema.ObjectId,
        	ref: UserModel
        },
        title: String,
        search: String,
        timelineCount: Number,
        languages: [{type:String, ref: LanguageModel}],
        seedSources: [String]
    });

module.exports = mongoose.model('Topic', TopicSchema);