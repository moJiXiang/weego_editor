var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async  = require('async'),
    log    = require('winston'),
    ObjectId = Schema.ObjectId;

/**
 * task model
 * @type:  attraction: 0, restaurant: 1, shopping: 2, shoparea: 3, city: 4,
 * city_id : id of city, 
 */
var TaskSchema = new Schema({
	city_id          : { type: ObjectId ,index: true },
    city_name        : { type: String },
	type 			 : { type: Number },
	minnum 			 : { type: Number }, //expected No. of items to be completed.
	editor_id 		 : { type: ObjectId ,index: true },
	editor_name 	 : { type: String },
	en 				 : { type: Boolean },
	create_at 		 : { type: Date, default: Date.now },
    completed        : { type: Boolean, default: false }, //indicator
    counts           : {
        // expected : Number, // expected count
        active    : Number, //ready and active
        editing   : Number, //editing in progress
        submitted : Number  //submitted for auditing, now yet auditted
    }
},{
	collections : 'task'
});

var guessModel = (function () {
    var models = ['Attraction', 'Restaurant', 'Shopping', 'Shoparea', 'City'];
    return function (type) { return mongoose.model(models[type]);};
})();

TaskSchema.statics = {

    updateAllCounts : function (opt, cb) {// update "counts" property of all matching records
        this.find(opt, function (err, docs) {
            if (err) return cb(err);
            async.map(docs, function (doc, cbb) {doc.updateCounts(cbb);}, function (err, results) {
                if (err) return cb(err);
                cb(null, results);
            });
        });
    }
}

TaskSchema.methods = {

    updateCounts : function (opt, cb) { // check how many left to be achieved
        var that    = this,
            cb      = cb ? cb : opt,
            Auditing = mongoose.model('Auditing');

        log.profile('counter'); //watch its performance
        async.parallel({
            active : function (done) {
                Auditing.count({item_city: that.city_id, type: that.type, en: that.en, status: 2}, done);
            },
            editing : function (done) {
                Auditing.count({item_city: that.city_id, type: that.type, en: that.en, status: {$in: [0, 3]}}, done);
            },
            submitted : function (done) {
                Auditing.count({item_city: that.city_id, type: that.type, en: that.en, status: 1}, done);
            }
        }, function (err, result) {
            log.profile('counter');
            if (err) return cb(err);
            that.counts = result;
            that.save(cb);
        });
    }
}


TaskSchema.queryMap = {
    /*name : function (q, value, done) {
        q.or([{cityname: {$regex: value}}, {cityname_en: {$regex: value}}]);
        done();//don't forget this callback
    }*/
    q : function (q, value, done) {
        q.where('name').regex(value);
        done();
    }
}

TaskSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Task', TaskSchema);
