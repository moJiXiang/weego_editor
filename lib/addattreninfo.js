
var assert = require('assert'),
    config = require('../config/Config'),
    async  = require('async'), 
    models = require('../models');
var addEnInfo = function(offset, limit, type){
    var model;
    switch(type) {
        case 0 : model = models.Attraction; break;
        case 1 : model = models.Restaurant; break;
        case 2 : model = models.Shopping;   break;
        case 3 : model = models.Area;       break;
        case 4 : model = models.City;       break;
    }
    var continents = [
    	{code: 'EU',name_en: 'Europe' },
        {code: 'NA',name_en: 'North America'},
        {code: 'AS', name_en: 'Asia'},
        {code: 'OC', name_en: 'Oceania'},
        {code: 'SA', name_en: 'South America'}
    ]
    if (!model) {
        console.log("error : no model found for : " + type);
    }

    model.query({offset:offset, limit:limit}, function (err, items) {
        nextAvailable = items.length >= limit ;
        async.map(items, function (item, cb) {
            var doc = item;
            
            switch(doc.continentscode) {
                case 'EU' : doc.en_info.continents = 'Europe'; break;
                case 'NA' : doc.en_info.continents = 'North America'; break;
                case 'AS' : doc.en_info.continents = 'Asia'; break;
                case 'OC' : doc.en_info.continents = 'Oceania'; break;
                case 'SA' : doc.en_info.continents = 'South America'; break;
            }
            models.Country.findOne({cn_name : doc.countryname}, function(err, result) {
                if(err) {
                    log.err(err)
                } else {
                    if(result && result.name) {
                        doc.en_info.countryname = result.name;
                        doc.save(function(err, result){
                            if(err){
                                console.log(err)
                            } else {

                                console.log('modify city en_info success===>'+ result.en_info.continents)
                            }
                        })
                    }
                }
            })
            
            
        }, function (err, results) {
            if (err) {
                log.error(err);
            }
            if (nextAvailable) {
                console.log(offset+limit)
                addEnInfo(offset + limit, limit, type);
            } else {
                // process.exit();
            }
        });
    });
}


addEnInfo(0, 100, 4); //city