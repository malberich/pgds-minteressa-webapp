var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema,
	TweetMentionSchema = new Schema({
		id: Number,
		name: String,
		screen_name: String,
		start: Number,
		end: Number
	}),
	TweetHashtagSchema = new Schema({
		text: String,
		start: Number,
		end: Number
	}),
	TweetLinkSchema = new Schema({
		url: String,
		display_url: String,
		expand_url: String,
		start: Number,
		end: Number
	}),
	TweetUserSchema = new Schema({
		profile_sidebar_fill_color: String,
		profile_sidebar_border_color: String,
		profile_background_tile: Boolean,
		name: String,
		profile_image_url: String,
		created_at: Date,
		location: String,
		follow_request_sent: Boolean,
		profile_link_color: String,
		is_translator: Boolean,
		id_str: String,
		entities: {
			url: {
				urls: [TweetLinkSchema]
			},
			description: {
				urls: [TweetLinkSchema]
			}
		},
		default_profile: Boolean,
		contributors_enabled: Boolean,
		favourites_count: Number,
		url: String,
		profile_image_url_https: String,
		utc_offset: Number,
		id: Number,
		profile_use_background_image: Boolean,
		listed_count: Number,
		profile_text_color: String,
		lang: String,
		followers_count: Number,
		protected: Boolean,
		notifications: [String],
		profile_background_color: String,
		profile_background_image_url: String,
		profile_background_image_url_https: String,
		verified: Boolean,
		geo_enabled: Boolean,
		time_zone: String,
		description: String,
		default_profile_image: Boolean,
		statuses_count: Number,
		friends_count: Number,
		following: Boolean,
		show_all_inline_media: Boolean,
		screen_name: String
	}),

	TweetSchema   = new Schema({
	    id: Number,
	    id_str: String,
	    created_at: Date,
	    source: String,
	    favorited: Boolean,
	    truncated: Boolean,
	    language: String,
	    contributors: String,
        text: String,
        entities: {
	    	user_mentions: [TweetMentionSchema],
	    	hashtags: [TweetHashtagSchema],
	    	urls: [TweetLinkSchema]
	    },
	    in_reply_to_user_id: Number,
        in_reply_to_user_id_str: String,
        geo: {Number},
        in_reply_to_status_id: Number,
	    in_reply_to_status_id_str: String,
        retweeted: Boolean,
        possibly_sensitive: Boolean,
        place: String,
        user: TweetUserSchema,
        in_reply_to_screen_name: String,
		source: String,
		reviewed: Number
	});


module.exports = mongoose.model('Tweet', TweetSchema);