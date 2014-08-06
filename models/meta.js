var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var MetaSchema = new Schema({
    type  : String,
    value : String,
    name  : String,
    pos   : Number, //could be useful for ordering
    roles : Array  //optional property to restrict access to some records

}, {
    collection : 'meta'
});

MetaSchema.statics = {

    load : function (id, cb) {
        this.findOne({_id: id})
            .exec(cb);
    }
}

MetaSchema.methods = {

}

MetaSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    roles : function (q, value, done) {
        var arr = value instanceof Array ? value : value.split(',');
        
        var or = {$or: [
            {roles: {$exists: false}}, 
            {roles: {$size: 0}}, 
            {roles: {$elemMatch: {$in: arr}}}
        ]};
        q.where(or);
        done();
    }
}

MetaSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Meta', MetaSchema);
