var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

 //type 0:景点，1:餐馆，2：购物，3：游玩。
var PathSchema = new Schema({
	city_id        : { type: ObjectId ,index: true },
	city_name      : { type: String },
	a_id           : { type: ObjectId ,index: true },
	a_type         : { type: String },
	b_id           : { type: ObjectId ,index: true },
	b_type         : { type: String },
	a_latitude     : { type: String },
    a_longitude    : { type: String },
	b_latitude     : { type: String },
	b_longitude    : { type: String },
	driver         : {       
		taxifare   : { type: String },
		duration   : { type: String },
		distance   : { type: String },
		steps      : { type: Array }
	},                    
	bus            : {            
		duration   : { type: String },
		distance   : { type: String },
		steps      : { type: Array }
	},                      
	walk           : {                 
		duration   : { type: String },
		distance   : { type: String },
		steps      : { type: Array }
	}
});

PathSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
}

PathSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Path', PathSchema);
