var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    log      = require('winston'),
    ObjectId = Schema.ObjectId;
 
 //购物
var ShoppingSchema = new Schema({
    name           : { type: String },
    type           : { type: String, default:'2'},
    city_name      : { type: String },
    city_id        : { type: ObjectId, index: true, required: true }, //auditing records requires this property not empty
    latitude       : { type: String },
    longitude      : { type: String },
    address        : { type: String },
    postal_code    : { type: String },
    introduce      : { type: String },
    tel            : { type: String },
    tips           : { type: String },
    category       : { type: Array },
    lifetag        : { type: Array },
    open_time      : { type: Array },
    image          : { type: Array },
    image_url      : { type: Array },
    cover_image    : { type: String },
    show_flag      : { type: Boolean, default: false },
    create_at      : { type: Date, default: Date.now },
    recommand_flag : { type: Boolean, default:false },
    local_flag     : { type: Boolean, default:false },
    ranking        : { type: Number },
    area_id        : { type: ObjectId },
    area_name      : { type: String },
    is_big         : { type: Boolean, default:false },
    // in_big_id      : { type: ObjectId },
    // in_big_name    : { type: String },
    rating         : { type: Number ,default: 3 },
    rating_service : { type: Number ,default: 3 },
    rating_env     : { type: Number ,default: 3 },
    rating_trust   : { type: Number ,default: 3 },
    score          : { type: Number ,default: 60 },
    reviews        : { type: Number ,default: 0 },
    comments       : { type: Array },
    price_level    : { type: Number },
    price_desc     : { type: String },
    url            : { type: String },
    status         : { type: String },
    en_info        : {
        introduce      : String,
        tips           : String,
        comments       : Array
    }
});

ShoppingSchema.post('save', function (doc) {
    if (doc.isNew) {
        log.info('new doc saved, now create corresponding auditing instances');
        mongoose.model('Auditing').onObjectCreated(doc, 2);
    }
});

ShoppingSchema.post('remove', function (doc) {
    mongoose.model('Auditing').onObjectRemoved(doc, 2);
});

ShoppingSchema.statics = {

};

ShoppingSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    q : function (q, value, done) {
        q.where('name').regex(value);
        done();
    },
    city_name : function (q, value, done) {
        q.where({'city_name': {$regex : value}});
        done();
    }
}

ShoppingSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Shopping', ShoppingSchema);
