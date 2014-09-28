var assert = require('assert'),
	config = require('../config/Config'),
	async = require('async'),
	log = require('winston'),
	models = require('../models'); //declar all models

var addeninfo = function(offset, limit) {
	var next = false;
	models.Attraction.query({
		offset: offset,
		limit: limit
	}, function(err, attractions) {
		next = attractions.length >= limit;
		async.each(attractions, function(a, cb) {
			console.log(a.en_info.tips)
			if (a.en_info.tips == '' || a.en_info.tips == undefined) {
				a.en_info.tips = 'Write Something to test.';
				a.save(function(err, result) {
					if (err) {
						console.log('error is===>' + err)
						cb(null,err)
					} else {
						// console.log('update success')
						cb(null, {_id : a._id})
					}
				})
			}
		}, function(err) {
			if (err) {
				log.error(err);
			}
			if (next) {
				console.log('offset====>' + offset, "limit====>" + limit)
				addeninfo(offset + limit, limit)
			}
		})
	})
}
addeninfo(0, 1000);