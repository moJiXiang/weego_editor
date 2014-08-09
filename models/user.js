var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    crypto   = require('crypto');

//ATTENTION !!!!
//THIS IS CMS USER, NOT WEBSITE USER, SO IS DIFFERENT AS DEFINED IN PROJECT WEEGO
//CMS user , it is different from website user
var UserSchema = new Schema({
    username : String,
    password : String,
    status   : {type : Number, default : 1}, // 1:active, 2:frozen, 3:deleted
    roles    : Array,  //value set : meta{type:'role'}
    groups   : Array

}, {
    collection : 'cmsUsers'
});

function md5sum(clearText) {
    var md5 = crypto.createHash('md5');
    md5.update(clearText);
    return md5.digest('hex');
}

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = md5sum(this.password);
    }
    next();
});

UserSchema.statics = {

    load : function (id, cb) {
        this.findOne({_id: id})
            .exec(cb);
    },

    createUser : function (opt, cb) {
        var model = this;
        model.findOne({username: opt.username}, function (err, exist) {
            if (err) cb(err);
            if (exist) {
                return cb (new Error('User Already Exist : ' + opt.username), exist);
            }
            if (! status in opt) {
                opt.status = 1;
            }
            model.save(opt, cb);
        });
    }
};

UserSchema.methods = {

    // async !!!
    hasPermission : function (resource, cb) {

        var that = this;

        mongoose.model('Perm').findOne({
            resource : resource,
            $or : {
                roles : {$elemMatch : {$in : that.roles}}, //any of user's role is in perm's roles ?
                users : {$all : [that._id]}  //is user's id in perm's users ?
            }
        }, function (err, perm) {
            if (err) cb(err, false);
            cb(null, perm); //success
        });
    },

    hasRole : function (role) {
        return this.roles && (this.roles.indexOf(role) > -1)
    },

    checkPassword : function(clearText) {  // check passwork equality
        return this.password == md5sum(clearText);
    }
};

UserSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    roles : function (q, value, done) {
        var arr = value.split(',')
        var condition = {roles:{$elemMatch : {$in : arr}}};
        q.where(condition);
        done();
    }
}

UserSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('User', UserSchema);
