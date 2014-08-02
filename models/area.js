var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //大类
 //餐馆 非洲菜，美洲菜等。
 //购物 种类，衣服，男装，女装，裤子，奢侈品，化妆品，等等。
 //游玩 种类，游泳池、SPA水疗馆、歌舞厅、KTV、桌球房、保龄球馆、棋牌室、网球场
 //type 1:餐馆，2：购物，3：游玩。
var AreaSchema = new Schema({
    city_id            : { type: ObjectId ,index: true },
    city_name          : { type: String },
    area_name          : { type: String },
    area_enname        : { type: String },
    short_introduce    : { type: String },
    area_introduce     : { type: String},
    address            : { type: String},
    open_time          : { type: String },
    latitude           : { type: String },
    longitude          : { type: String },
    image              : { type: Array },
    cover_image        : { type: String,default: '5327c20da71a2a9415000001.jpg'},
    traffic            : { type: String },
    tips               : { type: String},
    tags               : { type: Array},
    tel                : { type: String },
    website            : { type: String },
    status             : { type: String },
    en_info 		       : {
    	introduce        : { type: String },
    	address          : { type: String }
    },                               
    recommend_duration : { type: String }
});

AreaSchema.statics = {
    /**
     * queryByName use $regex
     * @param  {ObjectI}   opt 
     * @param  {Function} cb  
     * @return {array}    
     */
    queryByName : function (opt, cb) {
        this.find({area_name: {$regex: opt.criteria.value, $options: 'i'}})
            .skip(opt.offset || 0)
            .limit(opt.limit || 20)
            .exec(cb);
    }
}

AreaSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    name : function (q, value, done) {
        q.where('area_name', {$regex : value, $options: 'i'});
        done();
    }
}

AreaSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Area', AreaSchema);
