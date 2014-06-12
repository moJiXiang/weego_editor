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
    subLabel            : String,
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
    recommand_center    : String,
    weoid               : String  //yahoo weather api ID

}, {
    collection : 'latestcity'
});

CitySchema.methods = {

    /**
     * find restaurants in **this** city
     * city_id is automatically set : `opt.city_id = this.city_id`
     * 
     */
    listRestaurants : function (opt, cb) {
        opt.city_id = this.city_id;
        mongoose.model('Restaurant').listByCity(opt, cb);
    },

    
}

mongoose.model('City', CitySchema);
