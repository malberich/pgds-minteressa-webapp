var mongoose      = require('mongoose'),
	Schema        = mongoose.Schema,
    LanguageModel = require('./language'),

    UserSchema   = new Schema(
        {
            twitter: {
                id: Number,
                username: String,
                displayName: String,
                photos: [Object],
                token: String,
                tokenSecret: String
            },
            local: {
                email: String,
                password: String,
                locked: Boolean,
                created_at: Number,
                verified: Boolean,
                verification_token: String
            },
            topic: {
                status: Number, // 0 = undefined, 1 = feeding, 2 = running
                title: String,
                search: String,
                timelineCount: Number,
                languages: [{type:String, ref: LanguageModel}],
                seedSources: [String]
            }
        }
    );

module.exports = mongoose.model('User', UserSchema);