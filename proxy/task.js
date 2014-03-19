var models = require('../models');
var Task = models.Task;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getTask = function (id, callback) {
  Task.findOne({_id: id}, callback);
};

exports.getTasksByLimit = function (skip,pageLimit, callback) {
  Task.find({}, [], {sort: [['status','asc'],['create_at', 'desc']],skip:skip, limit:pageLimit}, function (err, tasks) {
		if(err)
			callback(err);
		else{
			callback(null,tasks);
		}
	});
};

exports.getTasksByQuery = function (query, callback) {
  Task.find(query, [], {sort: [['status','asc'],['create_at', 'desc']]}, function (err, tasks) {
		if(err)
			callback(err);
		else{
			callback(null,tasks);
		}
	});
};

exports.count = function (query,callback) {
  Task.count(query, callback);
};

exports.update = function(one,callback){
	exports.getTask(new ObjectID(one._id+''),function(err,task){
		if(task){
			task.city_id = one.city_id;
			task.city_name = one.city_name;
			task.name = one.name;
			task.editor_id = one.editor_id;
			task.days = one.days;
			task.total = one.total;
			task.desc = one.desc;
			task.save(function(err){
				callback(err,task);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var task = new Task();
	task.city_id = one.city_id;
	task.city_name = one.city_name;
	task.name = one.name;
	task.editor_id = one.editor_id;
	task.days = one.days;
	task.total = one.total;
	task.desc = one.desc;
	task.save(function (err) {
		callback(err, task);
	});
};
