var Task = require('../proxy').Task;
var Taskquestion = require('../proxy').Taskquestion;
var Auditing = require('../proxy').Auditing;
var Util = require('./util');

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
    var  type = req.params.type;
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

exports.getTasksByQuery = function(req,res){
    var name = req.params.name;
    var query = {};
    if(!Util.isNull(name)){
        if(Util.trim(name)!=""){
            query.name = {$regex:name};
        }
    }
     
    Task.getTasksByQuery(query,function(err,tasks){
        if(err)
            res.send({err:err});
        else
            res.send({result:tasks});
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