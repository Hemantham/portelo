var mongoose = require('mongoose'),	
	Schema = mongoose.Schema
	//crypto = require('crypto'),	
	//utility = require('../utility')


	/** 
 * schema.
 =================================================*/

var ClassroomSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});


mongoose.model('Classroom', ClassroomSchema);
