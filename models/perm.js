var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//Permission
var PermSchema = new Schema({
    resource : {
        type : String,  //value set : meta{type:'resourceType'}
        value : String
    },
    roles : Array,  //value set : meta{type:'role'}
    users : Array

}, {
    collection : 'perms'
});

PermSchema.statics = {

    load : function (id, cb) {
        this.findOne({_id: id})
            .exec(cb);
    }
}

PermSchema.methods = {

}

mongoose.model('Perm', PermSchema);
