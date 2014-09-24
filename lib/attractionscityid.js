var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'),
    log    = require('winston'),
    models = require('../models'); //declar all models


var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    log      = require('winston'),
    ObjectId = Schema.ObjectId;

var modifyAttrCityId = function(offset, limit) {
	var next = false;
	models.Attraction.query({offset: offset, limit: limit}, function(err, items) {
		next = items.length >= limit ;
		async.map(items, function(item, cb){
			var type = typeof item.cityid;
			if(type == 'string') {
				item.city_id = new ObjectId(item.cityid)
			} else {
				item.city_id = item.cityid;
			}
			item.save(function(err, attr) {
				if(err) {
					log.error('update attraction city_id failed ' + err)
					cb(null,err);					
				} else {
					log.info('update attraction city_id success');
					cb(null, {id: item._id})
				}
			})
		}, function(err, results) {
			if(err) {
				log.error("fail update attraction city_id "+err);
			}
			if (next) {
				console.log('limit offet ' + offset + limit)
				modifyAttrCityId(offset + limit, limit);
			}
		}) 
	})
}

modifyAttrCityId(0, 100)