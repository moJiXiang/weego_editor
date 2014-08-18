
var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'),
    log    = require('winston'),
    models = require('../models'); //declar all models

var initiateAuditingRecords = function (offset, limit, type) {
    var nextAvailable = false;
    var model;
    switch(type) {
        case 0 : model = models.Attraction; break;
        case 1 : model = models.Restaurant; break;
        case 2 : model = models.Shopping;   break;
        case 3 : model = models.Area;       break;
        case 4 : model = models.City;       break;
    }
    if (!model) {
        console.log("error : no model found for : " + type);
    }
    model.query({offset:offset, limit:limit}, function (err, items) {
        nextAvailable = items.length >= limit ;
        async.map(items, function (item, cb) {
            var doc = item;
            var cityids = ['cityid', 'city_id', 'city_id', 'city_id', '_id'];
            var citynames = ['attractions', 'name', 'name', 'area_name', 'cityname'];
            var cityId = doc[cityids[type]];
            var cityName = doc[citynames[type]];
            var da = {item_id: doc._id, type: type, name: cityName, en: true, status: 0, item_city: cityId};
            var db = {item_id: doc._id, type: type, name: cityName, en: false, status: 0, item_city: cityId};
            models.Auditing.create(da, db, function (err, a, b) {
                if (err) {
                    log.error('fail to create auditing records for %s:%s', type, doc._id);
                    cb(err);
                } else {
                    log.info('auditing records created for %s:%s : en=%s, zh=%s', type, doc._id, a._id, b._id, {});
                    cb(null, {id: doc._id, a: a._id, b: b._id});
                }
            });
        }, function (err, results) {
            if (err) {
                log.error(err);
            }
            if (nextAvailable) {
                initiateAuditingRecords(offset + limit, limit, type);
            } else {
                // process.exit();
            }
        });
    });
}


initiateAuditingRecords(0, 100, 0); //attractions
initiateAuditingRecords(0, 100, 1); //restaurants
initiateAuditingRecords(0, 100, 2); //Shopping
initiateAuditingRecords(0, 100, 3); //shoparea
initiateAuditingRecords(0, 100, 4); //city