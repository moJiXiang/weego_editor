var models = require('../models');
var Entertainment = models.Entertainment;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getEntertainment = function (id, callback) {
  Entertainment.findOne({_id: id}, callback);
};

exports.getEntertainments = function (skip,pageLimit, callback) {
  Entertainment.find({}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, entertainments) {
		if(err)
			callback(err);
		else{
			callback(null,entertainments);
		}
	});
};


exports.count = function (callback) {
  Entertainment.count({}, callback);
};

exports.update = function(one,callback){
	exports.getEntertainment(new ObjectID(one._id+''),function(err,entertainment){
		if(entertainment){
			entertainment.name = one.name;
			entertainment.city_name = one.city_name;
			entertainment.city_id = one.city_id;
			entertainment.latitude = one.latitude;
			entertainment.longitude = one.longitude;
			entertainment.address = one.address;
			entertainment.postal_code = one.postal_code;
			entertainment.introduce = one.introduce;
			entertainment.tel = one.tel;
			entertainment.category = one.category;
			entertainment.lifetag = one.lifetag;
			entertainment.open_time = one.open_time;
			entertainment.show_flag = one.show_flag;
			entertainment.price_level = one.price_level;
			entertainment.price_desc = one.price_desc;
			entertainment.url = one.url;
			entertainment.save(function(err){
				callback(err,entertainment);
			});
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(one,callback){
	var entertainment = new Entertainment();
	entertainment.name = one.name;
	entertainment.city_name = one.city_name;
	entertainment.city_id = one.city_id;
	entertainment.latitude = one.latitude;
	entertainment.longitude = one.longitude;
	entertainment.address = one.address;
	entertainment.postal_code = one.postal_code;
	entertainment.introduce = one.introduce;
	entertainment.tel = one.tel;
	entertainment.category = one.category;
	entertainment.lifetag = one.lifetag;
	entertainment.open_time = one.open_time;
	entertainment.show_flag = one.show_flag;
	entertainment.price_level = one.price_level;
	entertainment.price_desc = one.price_desc;
	entertainment.url = one.url;
	entertainment.save(function (err) {
		callback(err, entertainment);
	});
};
