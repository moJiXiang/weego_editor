var models = require('../models');
var Category = models.Category;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getCategory = function (id, callback) {
  Category.findOne({_id: id}, callback);
};

exports.getCategoryByEnName = function (en_name, callback) {
  Category.findOne({en_name: en_name}, callback);
};

exports.getCategorysByTypeLimit = function (type,skip,pageLimit, callback) {
  Category.find({type: type}).sort({'name': 'desc'}).skip(skip).limit(pageLimit).exec(callback)
};

exports.getCategorysByType = function(type,callback){
  Category.find({type: type}).sort({'name': 'desc'}).exec(callback)
};

exports.getCategorysByQuery = function(query,callback){
	Category.find(query).sort({'name': 'desc'}).exec(callback)
};

exports.count = function (type, callback) {
  Category.count({type: type}, callback);
};

exports.update = function(one,callback){
	exports.getCategory(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.type = one.type;
			result.name = one.name;
			result.en_name = one.en_name;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(type,name,en_name,callback){
	var category = new Category();
	category.type = type;
	category.name = name;
	category.en_name = en_name;
	category.save(function (err) {
		callback(err, category);
	});
};
