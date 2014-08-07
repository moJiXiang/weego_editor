
describe('Mongoose', function() {

    var assert = require('assert'),
        config = require('../config/Config')
        models = require('../models'); //declar all models

    beforeEach( function (done) {
        done();
    });

    it('should work with syntax keyword or', function (done) {
        var Restaurant = models.Restaurant;
        Restaurant.load('53869887e2d466a220000006', function(err , r) {
            console.log(r._id);
            done();
        });
    });

    it('should work with syntax keyword or', function (done) {
        var Attraction = models.Attraction;
        Attraction.findOne(function (err, one) {
            one.created = Date.now();
            one.save(function () {
                done();
            });
        });
    });

    it('find one use', function (done) {
        models.User.findOne({username:'Jay'}, function (err, user) {
            console.log(user.hasRole);
            done();
        });
    })
});