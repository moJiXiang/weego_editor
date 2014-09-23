var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'),
    log    = require('winston'),
    models = require('../models'); //declar all models

var modifyAttractionSubLabel = function() {
	var next = false;
	var model = models.Attraction;
	model.find().exists('subLabel', true).exec(function(err, items) {
		console.log(items.length)
		async.map(items, function(item, cb) {
			var sublabels = item.subLabel;
			// var sublabels = ["51d240d8a995c20632000008","51d2988dac05e5793d00001a","51d24da4ac05e5793d000004"]
			if(sublabels != null && sublabels[0] != '') {
				models.Label.query({criteria: {_id: {$in : sublabels}}}, function(err, items) {
					item.subLabelNew = items.map(function(item) {
						return {
							_id : item._id,
							label : item.label,
							label_en : item.label_en
						}
					})
					item.save(function(err, result) {
						if(err) {
							log.error('fail update sublabel ' + err);
						} else {
							log.info('modify sublabels success')
						}
					})
				})
			}
			// var masterlabel = item.masterLabel;
			// if(masterlabel){
			// 	models.Label.findOne({_id : masterlabel}, function(err, result) {
			// 		item.masterLabelNew._id = result._id;
			// 		item.masterLabelNew.label = result.label;
			// 		item.masterLabelNew.label_en = result.label_en;
			// 		item.save(function(err, result) {
			// 			if(err) {
			// 				log.error('fail to update masterLabel ' + err)
			// 				cb(err);
			// 			} else {
			// 				log.info('modify masterlabel success')
			// 				cb(null, {label: result.label})
			// 			}
			// 		})
			// 	})
			// }
		}, function(err, results) {
			console.log("sdasdfsdfsdfsdfsdf ")
			if(err) {
				log.error(err);
			}
			// if (next) {
			// console.log(offset+limit, limit)
			// 	modifyAttractionSubLabel(offset + limit, limit);
			// }
		})
	})

}

modifyAttractionSubLabel();