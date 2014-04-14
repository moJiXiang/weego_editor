var models = require('../models');
var Restaurant = models.Restaurant;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getRestaurant = function (id, callback) {
  Restaurant.findOne({_id: id}, callback);
};

exports.getRestaurantByName = function(name,callback){
	Restaurant.findOne({name:name},callback);
};

exports.getRestaurants = function (skip,pageLimit,query, callback) {
  Restaurant.find(query, [], {sort: [['city_name', 'asc'],['index_flag','desc'],['show_flag','desc'],['ranking', 'asc']],skip:skip, limit:pageLimit}, function (err, restaurants) {
		if(err)
			callback(err);
		else{
			// for(var i=0;i<restaurants.length;i++){
			// 	var categorys = restaurants[i].category;
			// 	var tmp = [];
			// 	console.log(categorys.length);
			// 	for(var j=0;j<categorys.length;j++){
			// 		console.log('v '+global.bigs.length);
			// 		for(var k=0;k<global.bigs.length;k++){
			// 			if(isIn(categorys[j]._id,global.bigs[k])){
			// 				if(isInTmp(global.bigs[k],tmp)){

			// 				}else{
			// 					tmp.push(global.bigs[k]);
			// 				}
			// 			}else{
			// 				// console.log('not found');
			// 			}
			// 		}
			// 	}
			// 	restaurants[i].category = tmp;
			// }

			callback(null,restaurants);
		}
	});
};

var isIn = function(id,big){
	for(var i=0;i<big._ids.length;i++){
		if(id.toString()==big._ids[i].toString())
			return true;
	}
	return false;
};

var isInTmp = function(a,b){
	for(var i=0;i<b.length;i++){
		if(a.en_name==b[i].en_name){
			return true;
		}
	}
	return false;
};

exports.getRestaurantsByQuery = function(query,callback){
	Restaurant.find(query, [], {sort: [['city_name', 'asc'],['index_flag','desc'],['show_flag','desc'],['ranking', 'asc']]}, function (err, restaurants) {
		if(err)
			callback(err);
		else{
			callback(null,restaurants);
		}
	});
};


exports.count = function (query,callback) {
  Restaurant.count(query, callback);
};

exports.updateShowFlag = function(_id,show_flag,callback){
	exports.getRestaurant(_id,function(err,one){
		if(one){
			one.show_flag = show_flag;
			one.save(function(err2){
				callback(err2,one);
			});
		}else{
			callback(err,one);
		}
	});
};

exports.update = function(one,callback){
	exports.getRestaurant(new ObjectID(one._id+''),function(err,restaurant){
		if(restaurant){
			var comments = [];
			comments.push(one.comments);
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
			restaurant.website = one.website;
			restaurant.recommand_flag = one.recommand_flag;
			restaurant.index_flag = one.index_flag;
			restaurant.local_flag = one.local_flag;
			if(one.area_id){
				restaurant.area_id = one.area_id;
				restaurant.area_name = one.area_name;
			}
			restaurant.rating = one.rating;
			restaurant.ranking = one.ranking;
			restaurant.reviews = one.reviews;
			restaurant.comments = comments;
			restaurant.michilin_flag = one.michilin_flag;
			
			restaurant.info = one.info;
			restaurant.save(function(err){
				callback(err,restaurant);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var restaurant = new Restaurant();
	var comments = [];
	comments.push(one.comments);
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
	restaurant.website = one.website;
	restaurant.recommand_flag = one.recommand_flag;
	restaurant.index_flag = one.index_flag;
	restaurant.local_flag = one.local_flag;
	if(one.area_id){
		restaurant.area_id = one.area_id;
		restaurant.area_name = one.area_name;
	}
	restaurant.rating = one.rating;
	restaurant.ranking = one.ranking;
	restaurant.reviews = one.reviews;
	restaurant.comments = comments;
	restaurant.michilin_flag = one.michilin_flag;

	restaurant.info = one.info;
	restaurant.save(function (err) {
		callback(err, restaurant);
	});
};
