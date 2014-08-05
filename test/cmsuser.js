

var assert   = require('assert'),
    config   = require('../config/Config'),
    models   = require('../models'),
    ObjectId = require('mongoose').Types.ObjectId;

describe('User Model', function() {

    beforeEach( function (done) {
        done();
    });

    it('validate model definition', function (done) {
        var model = models.User;
        model.createUser({username: 'Jay', password: '123', roles: ['adm']}, function (err, user) {
            done(err);
        });
    });
});
