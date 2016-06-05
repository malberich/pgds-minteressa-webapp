var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema,

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
            }
        }
    );

module.exports = mongoose.model('User', UserSchema);