var models = require('../models');
var Restaurant = models.Restaurant;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getRestaurant = function (id, callback) {
  Restaurant.findOne({_id: id}, callback);
};

exports.getRestaurants = function (skip,pageLimit, callback) {
  Restaurant.find({}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, restaurants) {
		if(err)
			callback(err);
		else{
			callback(null,restaurants);
		}
	});
};


exports.count = function (callback) {
  Restaurant.count({}, callback);
};

exports.update = function(one,callback){
	exports.getRestaurant(new ObjectID(one._id+''),function(err,restaurant){
		if(restaurant){
			restaurant.name = one.name;
			restaurant.city_name = one.city_name;
			restaurant.city_id = one.city_id;
			restaurant.latitude = one.latitude;
			restaurant.longitude = one.longitude;
			restaurant.address = one.address;
			restaurant.postal_code = one.postal_code;
			restaurant.introduce = one.introduce;
			restaurant.tel = one.tel;
			restaurant.category = one.category;
			restaurant.lifetag = one.lifetag;
			restaurant.open_time = one.open_time;
			restaurant.show_flag = one.show_flag;
			restaurant.price_level = one.price_level;
			restaurant.price_desc = one.price_desc;
			restaurant.url = one.url;
			restaurant.info = one.info;
			restaurant.save(function(err){
				callback(err,restaurant);
			});
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(one,callback){
	var restaurant = new Restaurant();
	restaurant.name = one.name;
	restaurant.city_name = one.city_name;
	restaurant.city_id = one.city_id;
	restaurant.latitude = one.latitude;
	restaurant.longitude = one.longitude;
	restaurant.address = one.address;
	restaurant.postal_code = one.postal_code;
	restaurant.introduce = one.introduce;
	restaurant.tel = one.tel;
	restaurant.category = one.category;
	restaurant.lifetag = one.lifetag;
	restaurant.open_time = one.open_time;
	restaurant.show_flag = one.show_flag;
	restaurant.price_level = one.price_level;
	restaurant.price_desc = one.price_desc;
	restaurant.url = one.url;
	restaurant.info = one.info;
	restaurant.save(function (err) {
		callback(err, restaurant);
	});
};
