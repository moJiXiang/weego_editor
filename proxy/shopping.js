
var models = require('../models');
var Shopping = models.Shopping;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getShopping = function (id, callback) {
  Shopping.findOne({_id: id}, callback);
};

exports.getShoppings = function (skip,pageLimit, callback) {
  Shopping.find({}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, shoppings) {
		if(err)
			callback(err);
		else{
			callback(null,shoppings);
		}
	});
};


exports.count = function (callback) {
  Shopping.count({}, callback);
};

exports.update = function(one,callback){
	exports.getShopping(new ObjectID(one._id+''),function(err,shopping){
		if(shopping){
			shopping.name = one.name;
			shopping.city_name = one.city_name;
			shopping.city_id = one.city_id;
			shopping.latitude = one.latitude;
			shopping.longitude = one.longitude;
			shopping.address = one.address;
			shopping.postal_code = one.postal_code;
			shopping.introduce = one.introduce;
			shopping.tel = one.tel;
			shopping.category = one.category;
			shopping.lifetag = one.lifetag;
			shopping.open_time = one.open_time;
			shopping.show_flag = one.show_flag;
			shopping.price_level = one.price_level;
			shopping.price_desc = one.price_desc;
			shopping.url = one.url;
			shopping.save(function(err){
				callback(err,shopping);
			});
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(one,callback){
	var shopping = new Shopping();
	shopping.name = one.name;
	shopping.city_name = one.city_name;
	shopping.city_id = one.city_id;
	shopping.latitude = one.latitude;
	shopping.longitude = one.longitude;
	shopping.address = one.address;
	shopping.postal_code = one.postal_code;
	shopping.introduce = one.introduce;
	shopping.tel = one.tel;
	shopping.category = one.category;
	shopping.lifetag = one.lifetag;
	shopping.open_time = one.open_time;
	shopping.show_flag = one.show_flag;
	shopping.price_level = one.price_level;
	shopping.price_desc = one.price_desc;
	shopping.url = one.url;
	shopping.save(function (err) {
		callback(err, shopping);
	});
};
