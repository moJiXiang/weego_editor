var async  = require('async'),
    config = require('../config/Config'),
	request = require('request'),
	fs = require('fs');
var models = require('../models');
var gm = require('gm')
,   imageMagick = gm.subClass({ imageMagick: true });

var ids = ['516a34f958e3511036000001','516a34f958e3511036000002','516a34f958e3511036000003'];
models.City.find({'_id':{$in:ids}}, function(err, cities) {
	var imgs = cities.map(function(c) {
		return c.coverImageName;
	})
	console.log(imgs)
	fs.readdir('./origin', function(err, files) {
		console.log(files);
		files.forEach(function(f) {
			imgs.forEach(function(i) {
				if(f == i) {
					fs.readFile('./origin/' + i, function(err, data) {
						if (err) throw err;
						gm('./origin/' + i).crop(width, height, x, y)
						fs.writeFile('./cities/' + f, data, function(err) {
							if(err) throw err;
						})
					});
				}
			})
		})
	})
})