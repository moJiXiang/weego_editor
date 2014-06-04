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
	area.area_name = one.area_name;
	area.area_enname = one.area_enname;
	area.introduce = one.introduce;
	area.address = one.address;
	area.latitude = one.latitude;
	area.longitude = one.longitude;
	area.cover_image = one.cover_image;
	area.save(function (err) {
		callback(err, area);
	});
};
