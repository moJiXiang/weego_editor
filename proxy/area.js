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

exports.getAreasByName = function(query, callback){
	Area.findOne(query,callback);
}
exports.getAreasByLimit = function (skip,pageLimit, callback) {
  Area.find({}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, areas) {
		if(err)
			callback(err);
		else{
			callback(null,areas);
		}
	});
};

exports.count = function (query, callback) {
  Area.count(query, callback);
};

exports.pushImg = function(_id, filename, callback) {
	Area.update({_id: _id},{$addToSet:{image:filename}},callback);
};

exports.pullImg = function(_id, filename, callback) {
	Area.update({_id: _id},{$pull: {image: filename}}, callback);
};

exports.setAreaCoverImg = function(_id, filename, callback) {
	Area.update({_id: _id},{$set:{cover_image: filename}}, callback);
}

exports.update = function(one,callback){
	console.log(one);
	exports.getArea(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.city_id = new ObjectID(one.city_id+'');
			result.city_name = one.city_name;
			result.area_name = one.area_name;
			result.area_enname = one.area_enname;
			result.area_introduce = one.area_introduce;
			result.address = one.address;
			result.latitude = one.latitude;
			result.longitude = one.longitude;
			result.cover_image = one.cover_image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.updateAudit = function(one, callback){
	Area.update({area_name: one.name},{$set:{
		status : one.status,
		editorname : one.editorname,
		editdate : one.editdate?one.editdate:'',
		auditorname : one.auditorname,
		auditdate : one.auditdate?one.auditdate:''
	}},function(err, result){
		console.log(err);
	})
}

exports.newAndSave = function(one,callback){
	var area = new Area();
	area.city_id = new ObjectID(one.city_id+'');
	area.city_name = one.city_name;
	area.area_name = one.area_name;
	area.area_enname = one.area_enname;
	area.area_introduce = one.area_introduce;
	area.address = one.address;
	area.latitude = one.latitude;
	area.longitude = one.longitude;
	area.cover_image = one.cover_image;
	area.save(function (err) {
		callback(err, area);
	});
};
