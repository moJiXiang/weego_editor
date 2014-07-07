var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*
 *	Edituser model
 *	_id, username, password, type
 *	type:0-administrator,1-editor
 */
 var EdituserSchema = new Schema({
 	_id			: { type: ObjectId },
 	username	: { type: String },
 	password	: { type: String },
 	type		: { type: Number }
 })

 mongoose.model('Edituser', EdituserSchema);