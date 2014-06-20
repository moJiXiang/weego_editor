
var assert   = require('assert'),
    config   = require('../config/Config'),
    models   = require('../models'),
    // async    = require('async'),
    Restaurant= models.Restaurant,
    ObjectId = require('mongoose').Types.ObjectId;

describe('Restaurant Model', function() {

    beforeEach( function (done) {
        done();
    });

    it('validate model definition', function (done) {
        Restaurant.findOne({city_name : '伦敦',tags : {$all : ['michilin']}}, function (err, r) {
            assert(!err);
            console.log(r.tags);
            r.addTag('michilin', function(err, r) {
                
            });
            done();
        });
    });
});
