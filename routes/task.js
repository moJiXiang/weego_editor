var Task = require('../proxy').Task;
var Taskquestion = require('../proxy').Taskquestion;
var Auditing = require('../proxy').Auditing;
var Util = require('./util');
var ObjectID = require('mongodb').ObjectID;

//-------------------------task----------------------------
exports.getTask = function(req,res){
	Task.getTask(new ObjectID(req.params.taskId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getTaskByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Task.count({},function (err, count) {
        Task.getTasksByLimit(skip,req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({tasks:result, count:count});
            }
        });
    });
};

exports.getTasksIndex = function(req,res){
	var userId = req.session.user._id;
	Task.getTasksByQuery({editor_id:userId},function(err,tasks){
        if(err)
            res.send({status:false,err:err});
        else{
        	if(tasks&&tasks.length>4)
        		res.send({status:true,results:tasks.splice(0,4)});
        	else
        		res.send({status:true,results:tasks});
        }
    });
};

exports.getMyToDoTasks = function(req,res){
    var userId = req.session.user._id;
    Task.getTasksByQuery({editor_id:userId,status:10},function(err,tasks){
        if(err)
            res.send({status:false,err:err});
        else{
            res.send({status:true,results:tasks});
        }
    });
};

exports.removeTask = function(req, res){
    Task.getTask(new ObjectID(req.params.taskId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
			if(result){
				result.remove();
			}
			res.send({_id:req.params.taskId});
        }
    });
};

exports.addNewTask = function(req, res){
    var task = req.body;
    Task.newAndSave(task, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateTask = function(req, res){
    var json = req.body;
    Task.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

//-------------------------Auditing----------------------------
exports.getAuditing = function(req,res){
    Auditing.getAuditing(new ObjectID(req.params.taskId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getAuditingByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Auditing.count({},function (err, count) {
        Auditing.getAuditingsByLimit(skip,req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({auditings:result, count:count});
            }
        });
    });
};

exports.getAuditingsIndex = function(req,res){
    var userId = req.session.user._id;
    Auditing.getAuditingsByQuery({editor_id:userId},function(err,auditings){
        if(err)
            res.send({status:false,err:err});
        else{
            if(auditings&&auditings.length>4)
                res.send({status:true,results:auditings.splice(0,4)});
            else
                res.send({status:true,results:auditings});
        }
    });
};

exports.getMyToDoAuditings = function(req,res){
    var userId = req.session.user._id;
    Auditing.getAuditingsByQuery({editor_id:userId,status:10},function(err,auditings){
        if(err)
            res.send({status:false,err:err});
        else{
            res.send({status:true,results:auditings});
        }
    });
};

exports.removeAuditing = function(req, res){
    Auditing.getAuditing(new ObjectID(req.params.auditingId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.auditingId});
        }
    });
};

exports.addNewAuditing = function(req, res){
    var auditing = req.body;
    Auditing.newAndSave(auditing, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateAuditing = function(req, res){
    var json = req.body;
    Auditing.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};