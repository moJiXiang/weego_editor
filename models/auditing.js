var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //申请审核条目。
 //type: 0 attraction, 1 restaurant, 2 shopping. 3 entertainment
 //item_id
var AuditingSchema = new Schema({
	city_id: { type: ObjectId ,index: true },
	city_name: { type: String },
	task_id: { type: ObjectId ,index: true },
	item_id: { type: ObjectId },
	type: { type: String },
	name: { type: String },
	create_at: { type: Date, default: Date.now }
});

mongoose.model('Auditing', AuditingSchema);
