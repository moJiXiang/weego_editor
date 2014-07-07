
var assert   = require('assert'),
    config   = require('../config/Config'),
    models   = require('../models'),
    proxy    = require('../proxy'),
    // async    = require('async'),
    Restaurant= models.Restaurant,
    ObjectId = require('mongoose').Types.ObjectId;

describe('Restaurant Model', function() {

    beforeEach( function (done) {
        done();
    });

    it('validate model definition', function (done) {
        var one = {
            _id: "5322c08d2fab6f0c1d00000f",
            address: "1116 Washington St",
            am: true,
            area_id: undefined,
            area_name: "",
            category: [],
            city_id: "516a34f958e3511036000001",
            comments: "This is the only five star rated Yelp place to eat in Hoboken...<br><br>Can you believe that and it is a deli!<br><br>This place will not disappoint, great Italian sandwiches, cold-cuts, pasta, and delicacies! <br><br>A sandwich is not cheap but even a half of sandwich can fill two people!<br><br>Possibly the best Fresh Mozz ever!!!<br><br>There is a reason that this place has the highest rating in Hoboken, and it isnt hype!<br><br>In fact it is probably more of an untold secret in the land of the trendy hipsters who thrive on superflous narcissistic notions and blatant materialism...",
            ev: true,
            index_flag: false,
            info: Object,
            introduce: "Grocery in Hoboken, NJ",
            latitude: "40.750666",
            lifetag: ['china'],
            longitude: "-74.027198",
            name: "M & P Biancamano",
            open_time: [],
            pm: true,
            postal_code: undefined,
            price_desc: "Under $10",
            price_level: "1",
            ranking: "15",
            rating: "5",
            recommand_duration: "",
            recommand_flag: false,
            reviews: "57",
            show_flag: undefined,
            tags: ['michilin','localflag'],
            tel: "(201) 795-0274",
            tips: "",
            url: "http://www.yelp.com/biz/m-and-p-biancamano-hoboken",
            website: ""
        }
        proxy.Restaurant.update(one, function(err, result) {

            console.log('err is '+ err);
            console.log(result);
            done();
        });
    });
});
