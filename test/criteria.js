
var assert = require('assert'),
    config = require('../config/Config'),
    models = require('../models');

describe('Criteria', function() {

    beforeEach( function (done) {
        done();
    });

    it('static method exists : query', function () {
        assert(models.City.query);
    });

    it('Count', function (done) {
        models.City.query({countNum: true}, function (err, count) {
            assert(count > 0);
            done();
        });
    });

    it('Filter Fields', function (done) {
        models.City.query({fields: 'cityname,created', cityname: '慕尼黑'}, function (err, docs) {
            docs.forEach(function(doc) {
                assert(doc.cityname);
                assert(!doc.latitude);
            });
            done();
        });
    });

    it('Customized Query with user defined param processor', function (done) {
        assert(models.City.schema.queryMap.name);
        models.City.query({name: '纽'}, function (err, docs) {
            assert.equal(1, docs.length);
            assert(docs[0].cityname == '纽约')
            done();
        });
    });
});

