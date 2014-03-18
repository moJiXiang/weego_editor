var models = require('../models');
var Auditing = models.Auditing;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getAuditing = function (id, callback) {
  Auditing.findOne({_id: id}, callback);
};

exports.getAuditingsByLimit = function (skip,pageLimit, callback) {
  Auditing.find({}, [], {sort: [['create_at', 'desc']],skip:skip, limit:pageLimit}, function (err, auditings) {
		if(err)
			callback(err);
		else{
			callback(null,auditings);
		}
	});
};

exports.getAuditingsByQuery = function (query, callback) {
  Auditing.find(query, [], {sort: [['create_at', 'desc']]}, function (err, auditings) {
		if(err)
			callback(err);
		else{
			callback(null,auditings);
		}
	});
};

exports.count = function (query,callback) {
  Auditing.count(query, callback);
};

exports.update = function(one,callback){
	exports.getAuditing(new ObjectID(one._id+''),function(err,auditing){
		if(auditing){
			auditing.city_id = one.city_id;
			auditing.city_name = one.city_name;
			auditing.task_id = one.task_id;
			auditing.item_id = one.item_id;
			auditing.editor_id = one.editor_id;
			auditing.type = one.type;
			auditing.name = one.name;
			auditing.save(function(err){
				callback(err,auditing);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var auditing = new Auditing();
	auditing.city_id = one.city_id;
	auditing.city_name = one.city_name;
	auditing.task_id = one.task_id;
	auditing.item_id = one.item_id;
	auditing.editor_id = one.editor_id;
	auditing.type = one.type;
	auditing.name = one.name;
	auditing.save(function (err) {
		callback(err, auditing);
	});
};
