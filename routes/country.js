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

exports.getCountryByEnName = function(enName,callback){
	countryProvider.findOne({name:enName},{},function(err,one){
		if(err)
			callback(err);
		else
			callback(null,one);
	});
};

exports.getCountryCode = function(code,callback){
	countryProvider.findOne({code:code},{},function(err,one){
		if(err)
			callback(err);
		else
			callback(null,one);
	});
};