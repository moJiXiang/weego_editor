var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	log    = require('winston'),
	ObjectId = Schema.ObjectId;
 
 //log_type : 0,新建，1修改。

/**
 * 申请审核条目。
 * @type: city: 4, attraction: 0, restaurant: 1, shopping: 2, shoparea: 3
 * status: 1，审核中，2，审核通过，-1，审核不通过。
 */
var AuditingSchema = new Schema({
	item_id			: { type: ObjectId },
	item_city       : { type: ObjectId }, //null if type=4, city's
	type 			: { type: Number },
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

	},

	onObjectRemoved : function (doc, type) { //target object removed
		log.info('TODO : %s removed, should remove related auditings as well', doc._id);
	},

	onObjectCreated : function (doc, type) { //target object removed
		this.create({item_id: doc._id, type: type, en: true, status: 0}, {item_id: doc._id, type: type, en: false, status: 0}, function (err, a, b) {
			if (err) {
				log.error('fail to create auditing records for %s:%s', type, doc._id);
			} else {
				log.info('auditing records created for %s:%s : en=%s, zh=%s', type, doc._id, a._id, b_id);
			}
		});
	}
}

AuditingSchema.methods = {

	comment : function (opt, cb) {
		this.auditcomment.push(opt);
		this.save(cb);
	},

	triggerTaskUpdate : function () {
		mongoose.model('Task').updateAllCounts({city_id: that.item_city, en: that.en, type: that.type}, function (err, docs) {
			//background operations, no need to cb here
			if (err) {
				log.error('Update Tasks failed : %s', err);
			} else {
				log.info('Update %s Tasks success', docs.length);
			}
		});
	},

	updateStatus : function (opt, cb) {
		var that = this;
		that.status = opt.status;
		that.save(function (err, doc) {
			if (err) return cb(err);
			that.triggerTaskUpdate();
			cb(null, doc);
		});
	},

	submit  : function (opt, cb) { //submit for auditing/review
		var cb = cb ? cb : opt;
		this.updateStatus({status: 1}, cb);
	},

	approve : function (opt, cb) { //pass the review/audit
		//1. set status, 2. update item status
		var cb = cb ? cb : opt;
		this.updateStatus({status: 2}, cb);
	},

	fail : function (opt, cb) { //fail the review/audit
		var cb = cb ? cb : opt;
		this.updateStatus({status: -1}, cb);
	}
}

AuditingSchema.queryMap = {

	items : function (q, value, done) { //value : "id123,id384747d"
		var items = value.split(',');
		// items = items.map(function(item) {
		// 	return new ObjectId(item);
		// })
		q.where({
			item_id: {
				$in: items
			}
		});
		done();
	}
}

AuditingSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Auditing', AuditingSchema); 
 