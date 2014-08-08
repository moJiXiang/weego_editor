var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CountrySchema = new Schema({
	continent : { type: String },
	cn_name   : { type: String },
	name  	  : { type: String },
	code 	  : { type: String },
    color     : { type: String }, // don't really know what it means, copied from weego project
	phonecode : { type: String }
},{
    collection : 'countries'
});

CountrySchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    name : function (q, value, done) {
        q.where({name : {$regex: value, $options: 'i'}});
        done();
    },
    cn_name : function (q, value, done) {
        q.where({cn_name : {$regex: value}});
        done();
    },
    getCountriesByContinent : function (q, value, done) {
        console.log(value);
        q.where({continent: value});
        done();
    }
}

CountrySchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Country', CountrySchema);
