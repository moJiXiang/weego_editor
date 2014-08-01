var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CountrySchema = new Schema({
	continent : { type: String },
	cn_name   : { type: String },
	name  	  : { type: String },
	code 	  : { type: String },
	phonecode : { type: String }
},{
    collection : 'countries'
});

CountrySchema.statics = {
	queryByName : function (opt, cb) {
        this.find({name: {$regex: opt.criteria.value, $options: 'i'}}, cb);
    }
}

mongoose.model('Country', CountrySchema);
