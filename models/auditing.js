var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //申请审核条目。
 //type: city, attraction, restaurant, shoparea, shopping
 //log_type : 0,新建，1修改。
 //status: 0，尚未递交审核(编辑状态)，1，审核中，2，审核通过，-1，审核不通过。

/**
 * [AuditingSchema description]
 * @type {Schema}
 */
var AuditingSchema = new Schema({
	item_id			: { type: ObjectId },
	type 			: { type: String },
	name 			: { type: String },
	status			: { type: Number },
	en				: { type: Boolean },
	editorid		: { type: ObjectId },
	editorname		: { type: String },
	editdate		: { type: Date, default: Date.now },
	auditorid		: { type: ObjectId },
	auditorname		: { type: String },
	auditdate		: { type: Date, default: Date.now },
	auditcomment	: [{ 
		field		: { type: String },
		comment 	: { type: String },
		createdAt 	: { type: Date, default: Date.now }
	}]
});

AuditingSchema.statics = {

	getAuditByItemid : function (opt, cb) {

		this.find({item_id: opt.item_id}, cb);

	}
}

AuditingSchema.queryMap = {
    getAuditings : function (q, value, done) {
        q.where('cityids');
        done();
    }
}

AuditingSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Auditing', AuditingSchema); 
 