var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**
 * task model
 * @type: city: 4, attraction: 0, restaurant: 1, shopping: 2, shoparea: 3
 * city_id : id of city, 
 */
var TaskSchema = new Schema({
	city_id          : { type: ObjectId ,index: true },
	type 			 : { type: Number },
	minnum 			 : { type: Number },
	editor_id 		 : { type: ObjectId ,index: true },
	editor_name 	 : { type: String },
	en 				 : { type: Boolean },
	create_at 		 : { type: Date, default: Date.now },
},{
	collections : 'task'
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
