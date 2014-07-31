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

mongoose.model('Country', CountrySchema);
