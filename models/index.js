var mongoose = require('mongoose');

mongoose.connect(global.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', global.db, err.message);
    process.exit(1);
  }
});

// models
require('./category');
require('./lifetag');
require('./restaurant');
require('./shopping');
require('./entertainment');
require('./bigtype');
require('./area');
require('./task');
require('./taskquestion');
require('./auditing');


exports.Category = mongoose.model('Category');
exports.Entertainment = mongoose.model('Entertainment');
exports.Lifetag = mongoose.model('Lifetag');
exports.Restaurant = mongoose.model('Restaurant');
exports.Shopping = mongoose.model('Shopping');
exports.Bigtype = mongoose.model('Bigtype');
exports.Area = mongoose.model('Area');
exports.Task = mongoose.model('Task');
exports.Taskquestion = mongoose.model('Taskquestion');
exports.Auditing = mongoose.model('Auditing');
