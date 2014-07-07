var models = require('../models');
var Restaurant = models.Restaurant;
var ObjectID = require('mongodb').ObjectID;

exports.getRestaurant = function (id, callback) {
  Restaurant.findOne({_id: id}, callback);
};
exports.findRestaurants = function(query,option,callback) {
	var query = Restaurant.find(query);
	query.limit(option.limit);
	query.skip(option.skip);
	query.exec(callback);
	
};
exports.countRestaurant = function (query, callback) {
	Restaurant.count(query, callback);
};
exports.getRestaurantByName = function(query,callback){
	Restaurant.findOne(query,callback);
};

exports.getRestaurants = function (skip,pageLimit,query, callback) {
  Restaurant.find(query,[], {sort: [['city_name', 'asc'],['index_flag','desc'],['show_flag','desc'],['ranking', 'asc']],skip:skip, limit:pageLimit}, function (err, restaurants) {
		if(err)
			callback(err);
		else{
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

// exports.getRestaurantsByQuery = function(query,callback){
// 	console.info();
// 	Restaurant.find(query, function (err, restaurants) {
// 		console.log(">>>>>"+restaurants);
// 		if(err)
// 			callback(err);
// 		else{
// 			callback(null,restaurants);
// 		}
// 	});
// };
exports.getRestaurantOne = function (id, callback) {
  Restaurant.findOne({_id: id}, callback);
};

exports.getRestaurantsByQuery = function(id,callback){
	exports.getRestaurantOne(id, function(err,restaurant){
	  	if(restaurant){
  			callback(null,restaurant);
	  	}else{
	  		callback(err,restaurant);
	  	}
    });
};

exports.getRestaurantsByOptions = function(query,options,callback){
	Restaurant.find(query,[],options,callback);
};

exports.count = function (query,callback) {
  Restaurant.count(query,callback);
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
	// Restaurant.update({},{$unset:{local_flag:1}},false);
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
			restaurant.tips = one.tips;
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
			restaurant.recommand_duration = one.recommand_duration;
			restaurant.index_flag = one.index_flag;
			restaurant.am = one.am;
			restaurant.pm = one.pm;
			restaurant.ev = one.ev;
			restaurant.rating = one.rating;
			restaurant.ranking = one.ranking;
			restaurant.reviews = one.reviews;
			restaurant.comments = comments;
			restaurant.tags = one.tags;
			restaurant.info = one.info;
			
			restaurant.save(function(err){
				callback(err,restaurant);
			});

		}else{
			callback(err+'not found!');
		}
	});
};

exports.updatemsg = function(one, callback) {
	var _id = one._id;
	console.log(_id);
	var comments = [];
	comments.push(one.comments);
	Restaurant.update({_id: new ObjectID(_id)},{$set:{
			name : one.name,
			city_name : one.city_name,
			city_id : one.city_id,
			latitude : one.latitude,
			longitude : one.longitude,
			address : one.address,
			postal_code : one.postal_code,
			introduce : one.introduce,
			tips : one.tips,
			tel : one.tel,
			category : one.category,
			lifetag : one.lifetag,
			// open_time : one.open_time,
			show_flag : one.show_flag,
			price_level : one.price_level,
			price_desc : one.price_desc,
			url : one.url,
			website : one.website,
			recommand_flag : one.recommand_flag,
			recommand_duration : one.recommand_duration,
			index_flag : one.index_flag,
			am : one.am,
			pm : one.pm,
			ev : one.ev,
			rating : one.rating,
			ranking : one.ranking,
			// reviews : one.reviews,
			// comments : comments,
			// tags : one.tags,
			// info : one.info,
	}},callback)
}
exports.updateAudit = function(one, callback){
	Restaurant.update({name: one.name},{$set:{
		status : one.status,
		editorname : one.editorname,
		editdate : one.editdate,
		auditorname : one.auditorname,
		auditdate : one.auditdate
	}},function(err, result){
		console.log(err);
	})
}
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
	restaurant.tips = one.tips;
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
	restaurant.recommand_duration = one.recommand_duration;
	restaurant.index_flag = one.index_flag;
	// restaurant.local_flag = one.local_flag;
	restaurant.am = one.am;
	restaurant.pm = one.pm;
	restaurant.ev = one.ev;
	if(one.area_id){
		restaurant.area_id = one.area_id;
		restaurant.area_name = one.area_name;
	}
	restaurant.rating = one.rating;
	restaurant.ranking = one.ranking;
	restaurant.reviews = one.reviews;
	restaurant.comments = comments;
	restaurant.tags = one.tags;
	// restaurant.michilin_flag = one.michilin_flag;

	restaurant.info = one.info;
	restaurant.save(function (err) {
		callback(err, restaurant);
	});
};
