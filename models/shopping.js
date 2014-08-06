var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
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
    cover_image    : { type: String },
    show_flag      : { type: Boolean, default: false },
    create_at      : { type: Date, default: Date.now },
    recommand_flag : { type: Boolean, default:false },
    local_flag     : { type: Boolean, default:false },
    ranking        : { type: Number },
    area_id        : { type: ObjectId },
    area_name      : { type: String },
    is_big         : { type: Boolean, default:false },
    in_big_id      : { type: ObjectId },
    in_big_name    : { type: String },
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
    }
}

ShoppingSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Shopping', ShoppingSchema);
