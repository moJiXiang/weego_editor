var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'),
    log    = require('winston'),
    models = require('../models'); //declar all models

models.Attraction.query({offset: 1000, limit: 1000}, function(err, items) {
	// console.log(items.length)
	// var masterlabels = items.map(function(item) {
	// 	return item.masterlabel
	// })
	// console.log(masterlabels)
	async.each(items, function(item, cb) {
		if(item.masterLabel != null && item.masterLabel != undefined){
			models.Label.findOne({_id : item.masterLabel}, function(err, lb) {
				if(lb) {

					item.masterLabelNew = {
						_id : lb._id,
						label : lb.label,
						label_en : lb.label_en
					}
					
					item.save(function(err, result) {
						if(err) {
							log.error('fail to update masterLabel' + err)
							cb(err);
						} else {
							log.info('modify masterlabel success')
							cb(null, {label: item.label})
						}
					})
				}
			})
		}
	}, function(err) {
		if(err) {
			log.error('something is wrong with===>' + err)
		}
	})
})
// var modifyAttractionLabel = function(offset, limit) {
// 	var next = false;
// 	var model = models.Attraction;
// 	model.query({offset:offset, limit:limit},function(err, items) {
// 		console.log(items.length)
//         next = items.length >= limit ;
// 		async.map(items, function(item, cb) {
// 			var masterlabel = item.masterLabel;
// 			if(masterlabel != null && masterlabel != ''){
// 				models.Label.query({_id : masterlabel}, function(err, result) {
// 					if(result) {
// 						item.masterLabelNew = {
// 							_id : result._id,
// 							label : result.label,
// 							label_en : result.label_en
// 						}
						
// 						item.save(function(err, result) {
// 							if(err) {
// 								log.error('fail to update masterLabel' + err)
// 								cb(err);
// 							} else {
// 								log.info('modify masterlabel success')
// 								cb(null, {label: item.label})
// 							}
// 						})
// 					}
// 				})
// 			}
// 		}, function(err, results) {
// 			console.log("sdasdfsdfsdfsdfsdf ")
// 			console.log(next)
// 			if(err) {
// 				log.error("fail map sublabels "+err);
// 			}
// 			if (next) {
// 				console.log('limit offet ' + offset + limit)
// 				modifyAttractionLabel(offset + limit, limit);
// 			}
// 		})
// 	})

// }

// modifyAttractionLabel(0, 10);