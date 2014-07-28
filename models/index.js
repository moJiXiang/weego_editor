var mongoose = require('mongoose'),
    fs     = require('fs');


var cap = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var walk = function (options, cb) {
  var opt = options || {},
    path = opt.path;

  if (!path) throw new Error("path is a mandatory parameter");


  var files = fs.readdirSync(path).filter(function (file) {
    var excluded = opt.excludes && opt.excludes.some(function (ptn) {
      if (ptn instanceof RegExp) {
        return ptn.test(file);
      } else {
        return file == ptn;
      }
    });
    if (excluded) return false;

    var stat = fs.statSync(path + '/' + file);

    if (opt.isFile) {
      if (!stat.isFile()) return false;
    }
    if (opt.isDirectory) {
      if (!stat.isDirectory()) return false;
    }
    return true;
  });
  
  files.map(cb);
}

// TODO  why ?
mongoose.connect(global.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', global.db, err.message);
    process.exit(1);
  }
});


walk({path : __dirname, excludes : ['index.js'], isFile : true}, function (file) {
    
    var m   = file.replace(/\.js/, ''),
        mn  =  cap(m);
    
    require('./' + m);
    exports[mn] = mongoose.model(mn);
});