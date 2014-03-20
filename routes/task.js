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
    var editor_id = req.session.user._id;
    Task.count({editor_id:editor_id},function (err, count) {
        Task.getTasksByLimit(skip,req.params.pageLimit,editor_id, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
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
    var editor_id = req.session.user._id;
    var query = {editor_id:editor_id};
    Auditing.count(query,function (err, count) {
        Auditing.getAuditingsByLimit(skip,req.params.pageLimit,query, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
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

exports.askApproval = function(req,res){
    var editor_id = req.session.user._id;
    var curr_user = req.session.user.username;
    if(editor_id){
        var auditingId = req.params.auditingId;
        Auditing.getAuditing(auditingId,function(err,one){
            if(one){
                if(one.editor_id.toString()==editor_id.toString()||curr_user=='admin'){
                    one.status = 10;
                    one.save(function(err){
                        if(err)
                            res.send({status:false,err:err});
                        else
                            res.send({status:true,result:one});
                    });
                }else{
                    res.send({status:false,err:err+' or not found!'});
                }
            }else{
                res.send({status:false,err:err+' or not found!'});
            }
        });
    }else{
        res.send({status:false,err:'please login!'});
    }
};