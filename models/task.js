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

TaskSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    q : function (q, value, done) {
        q.where('name').regex(value);
        done();
    }
}

TaskSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Task', TaskSchema);
