var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //任务
 //10:待办，50，已完成。
var TaskSchema = new Schema({
	city_id          : { type: ObjectId ,index: true },
	name 			 : { type: String },
	type 			 : { type: String },
	minnum 			 : { type: Number },
	editor_id 		 : { type: ObjectId ,index: true },
	editor_name 	 : { type: String },
	en 				 : { type: Boolean },
	create_at 		 : { type: Date, default: Date.now },
});

mongoose.model('Task', TaskSchema);
