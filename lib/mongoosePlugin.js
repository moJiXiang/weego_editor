
var async = require('async');
//criteria builder

// exports.queryFn = function (model, map) {
//     return function (opt, cb) {

//         var q = opt.countNum ? model.count() : model.find();

//         if (!opt.countNum) { // not counting, add pagination
//             q.skip(opt.offset || 0).limit(opt.limit || 20);
//         }
//         if (opt.sort) { //sorting : "prop1,-prop2,prop3"
//             q.sort(opt.sort.split(',').join(' '));
//         }
//         if (opt.fields) {
//             q.select(opt.fields.split(',').join(' '));
//         }
//         if (opt.criteria) {
//             var criteria = typeof(opt.criteria) == 'string' ? JSON.parse(opt.criteria) : opt.criteria;
//             q.where(criteria)
//         }
//         model.schema.eachPath(function (path, def) {
//             if (path in opt) {
//                 q.where(path, opt[path]);
//             }
//         });

//         /*var map = {
//             nearby : function(q, value, done) {
//                 //value = {radius, lat, lon}
//             }
//         };*/

//         async.inject(Object.keys(map), q, function (q2, key, done) {

//             var value = opt[key];

//             if (!value) { //not in opt, skip
//                 return done();
//             }

//             map[key](q2, value, done);

//         }, function (err, result) {
//             if (err)
//                 cb (err);
//             else 
//                 q.exec(cb);
//         });
//     }
// }

exports.queryPlugin = function (schema, options) { //mongoose plugin, see http://mongoosejs.com/docs/plugins.html
    schema.static('query', function (opt, cb) {

        var model = this, map = schema.queryMap;

        var q = opt.countNum ? model.count() : model.find();

        if (!opt.countNum) { // not counting, add pagination
            q.skip(opt.offset || 0).limit(opt.limit || 20);
        }
        if (opt.sort) { //sorting : "prop1,-prop2,prop3"
            q.sort(opt.sort.split(',').join(' '));
        }
        if (opt.fields) {
            q.select(opt.fields.split(',').join(' '));
        }
        if (opt.criteria) {
            var criteria = typeof(opt.criteria) == 'string' ? JSON.parse(opt.criteria) : opt.criteria;
            q.where(criteria)
        }
        model.schema.eachPath(function (path, def) {
            if (path in opt && !(path in map)) {
                q.where(path, opt[path]);
            }
        });

        async.inject(Object.keys(map), q, function (q2, key, done) {

            var value = opt[key];

            if (!value) { //not in opt, skip
                return done();
            }

            map[key](q, value, done);

        }, function (err, result) {
            if (err)
                cb (err);
            else 
                q.exec(cb);
        });
    });
}
