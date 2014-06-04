
describe('Mongoose', function() {

    var assert = require('assert'),
        config = require('../config/Config'); //declar all models

    beforeEach( function (done) {
        done();
    });

    it('should work with syntax keyword or', function (done) {
        var Shopping = require('../proxy').Shopping;
        Shopping.count({name: 'Liberty', city_name: '伦敦', $or : [{address : {$regex : 'Marlborough'}}]}, function (err, count) {
            assert.equal(1, count);
            done();
        });
    });
});

describe('Testing', function () {

    it('should print word : works', function () {
        console.log('works');
    });

});