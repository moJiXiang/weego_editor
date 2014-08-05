var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CitySchema = new Schema({
    backgroundimage     : Array,
    cityname            : String,
    cityname_en         : String,
    cityname_py         : String,
    continents          : String,
    countryname         : String,
    coverImageName      : String,
    createFlag          : String,
    created             : { type : Date, default : Date.now},
    hot_flag            : String,
    image               : Array,
    imgFlag             : Boolean,
    introduce           : [{
        intrItemTitle   : String, 
        intrItemContent : String
    }],                         
    latitude            : String,
    likecount           : Number,
    longitude           : String,
    masterLabel         : String,
    recommand_day       : String,
    recommand_intensity : String,
    short_introduce     : String,
    show_flag           : String,
    subLabel            : Array,
    tips                : [{
        tipItemTitle    : String,
        tipItemContent  : String
    }],                      
    traffic             : [{
        traItemTitle    : String,
        traItemContent  : String
    }],                      
    continentscode      : String,
    countrycode         : String,
    recommand_center    : {
        name            : String,
        latitude        : String,
        longitude       : String,
        _id             : String
    },
    restaurant_overview : String, // overview of restaurants in city
    shopping_overview   : String, // overview of shoppings in city
    attraction_overview : String, // overview of attractions in city
    weoid               : String, //yahoo weather api ID
    status              : String,
    en_info: {
        short_introduce: String,
        attraction_overview: String,
        restaurant_overview: String,
        shopping_overview: String,
        introduce      : [{
            intrItemTitle   : String, 
            intrItemContent : String
        }],
        tips                : [{
            tipItemTitle    : String,
            tipItemContent  : String
        }],
        traffic             : [{
            traItemTitle    : String,
            traItemContent  : String
        }],
    }

}, {
    collection : 'latestcity'
});

CitySchema.statics = {

    load : function (id, cb) {
        this.findOne({_id: id})
            .exec(cb);
    },
    queryByName : function (opt, cb) {
        this.find({cityname_py: {$regex: opt.criteria.value}}, cb);
    }
}

CitySchema.methods = {

    /**
     * find restaurants in **this** city
     * city_id is automatically set : `opt.city_id = this.city_id`
     * 
     */
    listRestaurants : function (opt, cb) {
        opt.city_id = this.city_id;
        mongoose.model('Restaurant').listByCity(opt, cb);
    }
}

CitySchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    cityname_py : function (q, value, done) {
        console.log(q);
        console.log('________________________________');
        console.log(value);
        q.where('cityname_py', {$regex: value, $options: 'i'});
        done();
    }
}

CitySchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('City', CitySchema);
