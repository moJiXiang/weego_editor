var models = require('../models');
var Auditing = models.Auditing;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getAuditing = function (id, callback) {
  Auditing.findOne({_id: id}, callback);
};

exports.findAuditingByQuery = function(query,callback){
	Auditing.findOne(query,callback);
};

exports.getAuditingsByLimit = function (skip,pageLimit,query, callback) {
  Auditing.find(query).sort({'status': 'asc', 'create_at': 'desc'}).skip(skip).limit(pageLimit).exec(callback);
}

exports.getAuditingsByQuery = function (query, callback) {
  Auditing.find(query).sort({'status': 'asc', 'create_at': 'desc'}).exec(callback);
};

exports.count = function (query,callback) {
  Auditing.count(query, callback);
};

exports.deleteByQuery = function(query,callback){
	Auditing.remove(query,callback);
};

exports.updateStatus = function(_id,status,callback){
	exports.getAuditing(new ObjectID(_id+''),function(err,one){
		if(one){
			one.status = status;
			one.save(function(err){
				callback(err,one);
			});
		}else{
			callback(err+' or not found!');
		}
	});
};
exports.findAuditingByCityname = function (query, callback) {
	Auditing.findOne(query, function (err, auditing) {
		if (err) {
			callback(err);
		}else {
			callback(null, auditing);
		}
	})
}

exports.update = function(one,callback){
	Auditing.update({
		item_id: new ObjectID(one._id)
	}, {
		$set: {
			status: one.status,
			auditcomment: one.auditcomment,
			auditdate: one.auditdate
		}
	},callback)
	
	// exports.findAuditingByCityname({city_name: one.city_name},function(err,auditing){
	// 	// if(auditing){
	// 	// 	auditing.task_id = one.task_id;
	// 	// 	auditing.task_name = one.task_name;
	// 	// 	auditing.mod_at = Date.now();
	// 	// 	auditing.name = one.name;
	// 	// 	auditing.save(function(err){
	// 	// 		callback(err,auditing);
	// 	// 	});
	// 	// }else{
	// 	// 	callback(err+'not found!');
	// 	// }
	// 	if(err){
	// 		callback(err);
	// 	}else{
	// 		auditing.status = one.status;
	// 		auditing.auditcomment = one.auditcomment;
	// 		auditing.save(callback);
	// 	}
	// });
};
//如果是同一个item_id,和同一个editor_id 表明，不需要重新插入，只需要修改数据即可。
exports.newAndSave = function(one,callback){
	// if(!one.task_id){
	// 	return callback('task_id is null!');
	// }
	// var query = {editor_id:one.editor_id,item_id:one.item_id};
	// console.log(one);
	// exports.findAuditingByQuery(query,function(err,result){
	// 	if(result){
	// 		result.task_id = one.task_id;
	// 		result.task_name = one.task_name;
	// 		result.mod_at = Date.now();
	// 		result.name = one.name;
	// 		result.save(function(err){
	// 			callback(err,result);
	// 		});
	// 	}else{
	// 		var auditing = new Auditing();
	// 		auditing.city_id = one.city_id;
	// 		auditing.city_name = one.city_name;
	// 		auditing.task_id = one.task_id;
	// 		auditing.task_name = one.task_name;
	// 		auditing.item_id = one.item_id;
	// 		auditing.editor_id = one.editor_id;
	// 		auditing.type = one.type;
	// 		auditing.log_type = one.log_type;
	// 		auditing.name = one.name;
	// 		auditing.save(function (err) {
	// 			callback(err, auditing);
	// 		});
	// 	}
	// });
	var auditing = new Auditing();
	auditing.editorname = one.editorname;
	auditing.auditorname = one.auditorname;
	auditing.countryname = one.countryname;
	auditing.item_id = one.item_id;
	if(one.city_name) auditing.city_name = one.city_name;
	if(one.name){
		auditing.name = one.name;
	}
	auditing.status = one.status;
	auditing.type = one.type;
	if(one.editdate) auditing.editdate = one.editdate;
	if(one.auditdate) auditing.auditdate = one.auditdate;
	if(one.auditcomment) auditing.auditcomment = one.auditcomment;
	console.log("gonna call cb" + one);
	auditing.save(callback);
};
