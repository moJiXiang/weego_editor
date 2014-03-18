var models = require('../models');
var Area = models.Area;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getArea = function (id, callback) {
  Area.findOne({_id: id}, callback);
};

exports.getAreasByQuery = function(query,callback){
	Area.find(query, [], {sort: [['name', 'desc']]}, function (err, areas) {
		if(err)
			callback(err);
		else{
			callback(null,areas);
		}
	});
};

exports.getAreasByLimit = function (skip,pageLimit, callback) {
  Area.find({}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, areas) {
		if(err)
			callback(err);
		else{
			callback(null,areas);
		}
	});
};

exports.count = function ( callback) {
  Area.count({}, callback);
};

exports.update = function(one,callback){
	exports.getArea(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.city_id = new ObjectID(one.city_id+'');
			result.city_name = one.city_name;
			result.name = one.name;
			result.en_name = one.en_name;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var area = new Area();
	area.city_id = new ObjectID(one.city_id+'');
	area.city_name = one.city_name;
	area.name = one.name;
	area.en_name = one.en_name;
	area.save(function (err) {
		callback(err, area);
	});
};
