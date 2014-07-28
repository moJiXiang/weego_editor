var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//城市标签，主标签masterlabel，子标签，sublabel

var LabelSchema = new Schema({
	_id			: ObjectId,
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
        var c = opt.criteria || {};
        if (opt.city) {
            mongoose.model('City').findOne({_id:opt.city}, function(err, city) {
                var ids = city.subLabel;
                // c.level='2';
                c._id = {$in: ids};
                that.find(c)
                    .skip(c.offset || 0)
                    .limit(c.limit || 20)
                    .exec(cb);
            });
        } else {
            that.find(c)
                    .skip(c.offset || 0)
                    .limit(c.limit || 20)
                    .exec(cb);
        }
        
    }
}

mongoose.model('Label', LabelSchema);