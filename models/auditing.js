var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //申请审核条目。
 //type: 0 attraction, 1 restaurant, 2 shopping. 3 entertainment
 //log_type : 0,新建，1修改。
 //status: 0，尚未递交审核，10，递交审核，50，审核通过，40，审核不通过。
var AuditingSchema = new Schema({
	city_id: { type: ObjectId ,index: true },
	city_name: { type: String },
	task_id: { type: ObjectId ,index: true },
	task_name: { type:String },
	editor_id: { type: ObjectId ,index: true },
	item_id: { type: ObjectId },
	type: { type: String },
	log_type: { type: String },
	name: { type: String },
	status: { type: Number,default:0 },
	create_at: { type: Date, default: Date.now },
	mod_at: { type: Date, default: Date.now }
});

mongoose.model('Auditing', AuditingSchema);
