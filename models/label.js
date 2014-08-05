var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//城市标签，主标签masterlabel，子标签，sublabel

var LabelSchema = new Schema({
	classname 	: String,
	createFlag 	: String,
	label 		: String,
	level 		: String,
	subLabel 	: Array
},{
	collection  : 'label' 
});

LabelSchema.statics = {

    list: function (opt, cb) {
        var that = this;
        if (opt.level) {
            opt.criteria.level = opt.level;
        }
        that.find(opt.criteria)
            .skip(opt.offset || 0)
            .limit(opt.limit || 20)
            .exec(cb);
    },

    listByName : function (opt, cb) {

        opt.criteria = opt.criteria || {};
        opt.criteria.label = {$regex : opt.name};
        this.list(opt, cb);
    },

    listByCity : function (opt, cb) {
        var that = this;

        mongoose.model('City').findOne({_id: opt.city}, function(err, city) {
            if (!city || !city.subLabel || city.subLabel.length <1) { // no sublabel found
                cb(null, []);
                return;
            }
            var ids = city.subLabel;
            opt.criteria = opt.criteria || {};
            opt.criteria._id = {$in : ids};
            that.list(opt, cb);
        });
    },

    listByAttraction : function(opt, cb) {
        var that = this;
        mongoose.model('Attraction').findOne({_id: opt.attraction}, function(err, attraction) {
            if (!attraction || !attraction.subLabel || attraction.subLabel.length <1) { // no sublabel found
                cb(null, []);
                return;
            }
            var ids = attraction.subLabel;
            opt.criteria = opt.criteria || {};
            opt.criteria._id = {$in : ids};
            that.list(opt, cb);
        })
    }
}

LabelSchema.queryMap = {
    getLabelById : function (q, value, done) {
        q.where({
            _id: value,
            level: "2"
        });
        done();//don't forget this callback
    }

}

LabelSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Label', LabelSchema);