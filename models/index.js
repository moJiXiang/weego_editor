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

exports.Category = mongoose.model('Category');
exports.Entertainment = mongoose.model('Entertainment');
exports.Lifetag = mongoose.model('Lifetag');
exports.Restaurant = mongoose.model('Restaurant');
exports.Shopping = mongoose.model('Shopping');
