
var models = require('../models');
var Shopping = models.Shopping;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getShopping = function (id, callback) {
  Shopping.findOne({_id: id}, callback);
};
exports.findShoppings = function(query,callback) {
	Shopping.find(query, callback);
}
exports.findShopByName = function(query, callback){
	Shopping.findOne(query, callback);
}
exports.getFullShopping = function(id,callback){
	exports.getShopping(id, function(err,shopping){
	  	if(shopping){
	  		if(shopping.in_big_id){
	  			exports.getShopping(shopping.in_big_id, function(err2,one){
	  				if(one){
	  					shopping.in_big_name = one.name;
	  					callback(null,shopping);
	  				}
	  				else{
	  					callback(null,shopping);
	  				}
	  			});
	  		}else{
	  			callback(null,shopping);
	  		}
	  	}else{
	  		callback(err,shopping);
	  	}
    });
};

exports.getShoppings = function (skip,pageLimit,query, callback) {
	Shopping.find(query)
		.sort({'city_name':'asc', 'index_flag':'desc', 'show_flag':'desc', 'ranking':'asc'})
		.skip(skip).limit(pageLimit)
		.exec(callback);
};

exports.getShoppingsByQuery = function(query,callback){
	Shopping.find(query)
		.sort({'city_name':'asc', 'index_flag':'desc', 'show_flag':'desc', 'ranking':'asc'})
		.exec(callback);
};

exports.getShoppingsByOptions = function(query,options,callback){
	Shopping.find(query,null,options,callback);
};

exports.count = function (query,callback) {
  Shopping.count(query, callback);
};

exports.updateShowFlag = function(_id,show_flag,callback){
	exports.getShopping(_id,function(err,one){
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

exports.updatemsg = function(one, callback) {
	var _id = one._id;
	console.log(one);
	var comments = [];
		comments.push(one.comments);
	Shopping.update({'_id': new ObjectID(_id)},{$set:{
		name: one.name,
		city_name: one.city_name,
		city_id: one.city_id,
		latitude: one.latitude,
		longitude: one.longitude,
		address: one.address,
		// postal_code: postal_code,
		introduce: one.introduce,
		tips: one.tips,
		tel: one.tel,
		category: one.category,
		lifetag: one.lifetag,
		open_time: one.open_time,
		show_flag: one.show_flag,
		price_level: one.price_level,
		price_desc: one.price_desc,
		url: one.url,
		website: one.website,
		recommand_flag: one.recommand_flag,
		recommand_duration: one.recommand_duration,
		area_id: one.area_id,
		area_name: one.area_name,
		is_big: one.is_big,
		in_big_id: one.in_big_id,
		rating: one.rating,
		ranking: one.ranking,
		reviews: one.reviews,
		comments: one.comments,
		en_info: {
			introduce: one.en_info.introduce,
			tips: one.en_info.tips,
			comments: one.en_info.comments
		}
	}},callback)
}

exports.update = function(one,callback){
	exports.getShopping(new ObjectID(one._id+''),function(err,shopping){
		if(shopping){
			var comments = [];
			comments.push(one.comments);
			shopping.name = one.name;
			shopping.city_name = one.city_name;
			shopping.city_id = one.city_id;
			shopping.latitude = one.latitude;
			shopping.longitude = one.longitude;
			shopping.address = one.address;
			shopping.postal_code = one.postal_code;
			shopping.introduce = one.introduce;
			shopping.tips = one.tips;
			shopping.tel = one.tel;
			shopping.category = one.category;
			shopping.lifetag = one.lifetag;
			shopping.open_time = one.open_time;
			shopping.show_flag = one.show_flag;
			shopping.price_level = one.price_level;
			shopping.price_desc = one.price_desc;
			shopping.url = one.url;
			shopping.website = one.website;
			shopping.recommand_flag = one.recommand_flag;
			shopping.recommand_duration = one.recommand_duration;
			shopping.index_flag = one.index_flag;
			shopping.local_flag = one.local_flag;
			shopping.am = one.am;
			shopping.pm = one.pm;
			shopping.ev = one.ev;
			if(one.area_id){
				shopping.area_id = one.area_id;
				shopping.area_name = one.area_name;
			}
			shopping.is_big = one.is_big;
			if(one.in_big_id){
				shopping.in_big_id = one.in_big_id;
			}
			shopping.rating = one.rating;
			shopping.ranking = one.ranking;
			shopping.reviews = one.reviews;
			shopping.comments = comments;
			shopping.save(function(err){
				callback(err,shopping);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.updateAudit = function(one, callback){
	var _id = one.item_id;
	Shopping.update({_id: new ObjectID(_id)},{$set:{
		status : one.status,
		editorname : one.editorname,
		editdate : one.editdate,
		auditorname : one.auditorname,
		auditdate : one.auditdate 
	}},function(err, result){
		if(err){
			console.log("updateAudit err is==="+err);
		}
	})
};

exports.newAndSave = function(one,callback){
	var shopping = new Shopping();
	var comments = [];
	comments.push(one.comments);
	shopping.name = one.name;
	shopping.city_name = one.city_name;
	shopping.city_id = one.city_id;
	shopping.latitude = one.latitude;
	shopping.longitude = one.longitude;
	shopping.address = one.address;
	shopping.postal_code = one.postal_code;
	shopping.introduce = one.introduce;
	shopping.tips = one.tips;
	shopping.tel = one.tel;
	shopping.category = one.category;
	shopping.lifetag = one.lifetag;
	shopping.open_time = one.open_time;
	shopping.show_flag = one.show_flag;
	shopping.price_level = one.price_level;
	shopping.price_desc = one.price_desc;
	shopping.url = one.url;
	shopping.website = one.website;
	shopping.recommand_flag = one.recommand_flag;
	shopping.recommand_duration = one.recommand_duration;
	shopping.index_flag = one.index_flag;
	shopping.local_flag = one.local_flag;
	shopping.am = one.am;
	shopping.pm = one.pm;
	shopping.ev = one.ev;
	if(one.area_id){
		shopping.area_id = one.area_id;
		shopping.area_name = one.area_name;
	}
	shopping.is_big = one.is_big;
	if(one.in_big_id){
		shopping.in_big_id = one.in_big_id;
	}
	shopping.rating = one.rating;
	shopping.ranking = one.ranking;
	shopping.reviews = one.reviews;
	shopping.comments = comments;
	shopping.save(function (err) {
		callback(err, shopping);
	});
};
