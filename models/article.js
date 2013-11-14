var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	env = process.env.NODE_ENV || 'development',
    config = require('../config')[env],
	mongoosastic = require('mongoosastic');


	/** 
 * schema.
 =================================================*/

var ArticleSchema = new Schema({
	classroom: {
		type: mongoose.Schema.ObjectId,
		ref: 'ClassroomSchema',
		required: true
	},
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	keywords: [String],
	text: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	}
});

// elasticsearch stuff
ArticleSchema.plugin(mongoosastic, {
    index: 'articles',
    type: 'article',
    host: config.elasticsearch.host,
    port: config.elasticsearch.port
});

mongoose.model('Article', ArticleSchema);