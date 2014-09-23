var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'),
    log    = require('winston'),
    models = require('../models'); //declar all models

var modifyAttractionLabel = function() {
	var next = false;
	var model = models.Attraction;
	model.query({offset:offset, limit:limit},function(err, items) {
        next = items.length >= limit ;
		async.map(items, function(item, cb) {
			var masterlabel = item.masterLabel;
			if(masterlabel){
				models.Label.findOne({_id : masterlabel}, function(err, result) {
					if(result) {
						item.masterLabelNew._id = result._id;
						item.masterLabelNew.label = result.label;
						item.masterLabelNew.label_en = result.label_en;
						item.save(function(err, result) {
							if(err) {
								log.error('fail to update masterLabel')
								cb(err);
							} else {
								log.info('modify masterlabel success')
								cb(null, {label: result.label})
							}
						})
					}
				})
			}
		}, function(err, results) {
			console.log("sdasdfsdfsdfsdfsdf ")
			if(err) {
				log.error(err);
			}
			if (next) {
				modifyAttractionLabel(offset + limit, limit);
			}
		})
	})

}

modifyAttractionLabel(0, 100);