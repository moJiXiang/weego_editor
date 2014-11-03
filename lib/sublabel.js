var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'),
    log    = require('winston'),
    models = require('../models'); //declar all models

var modifyAttractionSubLabel = function(offset, limit) {
	var next = false;
	var model = models.Attraction;
	model.query({offset:offset, limit:limit},function(err, items) {
        next = items.length >= limit ;
		async.map(items, function(item, cb) {
			var sublabels = item.subLabel;
			// var sublabels = ["51d240d8a995c20632000008","51d2988dac05e5793d00001a","51d24da4ac05e5793d000004"]
			if(sublabels != null && sublabels[0] != '') {
				models.Label.query({criteria: {_id: {$in : sublabels}}}, function(err, items) {
					item.subLabelNew = items.map(function(item) {
						console.log(item)
						return {
							_id : item._id,
							label : item.label,
							label_en : item.label_en
						}
					})
					item.save(function(err, result) {
						if(err) {
							log.error('fail update sublabel ' + err);
							cb(err);
						} else {
							log.info('modify sublabels success')
							cb(null, {label: item.label})
						}
					})
				})
			}
		}, function(err, results) {
			console.log("sdasdfsdfsdfsdfsdf ")
			if(err) {
				log.error(err);
			}
			if (next) {
				console.log(offset+limit, limit)
				modifyAttractionSubLabel(offset + limit, limit);
			}
		})
	})

}

// modifyAttractionSubLabel(0, 1000);
// modifyAttractionSubLabel(1000, 2000);
// modifyAttractionSubLabel(2000, 3000);
modifyAttractionSubLabel(3000, 4000);