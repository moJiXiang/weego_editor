var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //购物
var ShoppingSchema = new Schema({
    name           : { type: String },
    type           : { type: String, default:'1'},
    city_name      : { type: String },
    city_id        : { type: ObjectId, index: true },
    latitude       : { type: String },
    longitude      : { type: String },
    address        : { type: String },
    postal_code    : { type: String },
    introduce      : { type: String },
    tel            : { type: String },
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
    editorname     : { type: String },
    editdate       : { type: String },
    auditorname    : { type: String },
    auditdate      : { type: String }
});

ShoppingSchema.statics = {

    /**
     * find recommended Shoppings.
     * ```
     * Shopping.listRecommends(function (err, arr) {});
     *     
     * Shopping.listRecommends({limit : 5, offset : 2}, function (err, arr) {});
     * ```
     * @param {Function} cb - callback (err, result)
     * @param {Any} opt - optional options
     */
    listRecommends : function (opt, cb) {
        var criteria = {show_flag: true};
            // order    = {coverImageId: 1, coverImageExtention: 1}; //TODO order recommends by what ?

        if (!cb && opt instanceof Function) {
            cb = opt;
        }

        this.find(criteria)
            .skip(opt.offset || 0)
            .limit(opt.limit || global.recommendLimit || 10)
            .exec(cb);
    }
};

mongoose.model('Shopping', ShoppingSchema);
