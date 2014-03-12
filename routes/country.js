require('../config/Config');
var CountryProvider = require("../config/CountryProvider").CountryProvider;
var countryProvider = new CountryProvider();

exports.getCountriesByContinent = function(continent,callback){
	countryProvider.find({continent:continent},{},function(err,countries){
		if(err)
			callback(err);
		else
			callback(null,countries);
	});
};