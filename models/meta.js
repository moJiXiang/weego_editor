var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var MetaSchema = new Schema({
    type : String,
    value : String,

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

mongoose.model('Meta', MetaSchema);
