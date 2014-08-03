
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var AttractionSchema = new Schema({
    address            : String,  
    am                 : Boolean,
    pm                 : Boolean,
    ev                 : Boolean, //evening
    attractions        : String,
    attractions_en     : String,
    checkFlag          : String,
    cityid             : String,
    cityname           : String,
    coverImageName     : String,
    createFlag         : String,  // who create it ?   0 : administrator(weego) , 1 : editor
    createPreson       : String,
    created            : {type : Date, default : Date.now},
    dayornight         : String,
    image              : Array,
    imgFlag            : Boolean,
    introduce          : String,
    latitude           : String,
    likecount          : Number,
    longitude          : String,
    masterLabel        : String,
    opentime           : String,
    price              : String,
    random             : String,  // ? ? ? ?
    recommand_duration : String,
    recommand_flag     : String,  // 1 : recommended as 'hot' , 0 : else
    short_introduce    : String,
    show_flag          : Number,  //whethere it is visible to end user
    subLabel           : Array,
    telno              : String,
    website            : String,
    traffic_info       : String,
    yelp_rating        : Number,
    yelp_review_count  : Number,
    yelp_update_time   : Number,
    type               : { type: String,default:'0'},
    status             : String,
    en_info: {
        opentime       : String,
        traffic_info   : String,
        short_introduce: String,
        introduce      : String,
        tips           : String
    }
}, {
    collection : 'latestattractions'
});

/**@namespace*/
AttractionSchema.statics = {


};

AttractionSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    tag : function (q, value, done) {
        var tags = value.split(',').join(' ');
        mongoose.model('Label').find({label: {$in : tags}}, function (err, labels) {
            if (err) return done(err);
            if (labels) {
                var ids = labels.map(function(i) {return i._id;});
                q.in('masterLabel', ids);
                return done();
            }
            return done();
        });
    },

    name : function (q, value, done) {
        q.where({attractions : {$regex: value, $options: 'i'}});
        done();
    }
}

AttractionSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Attraction', AttractionSchema);
