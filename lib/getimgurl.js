
var async  = require('async'),
    config = require('../config/Config'),
	request = require('request'),
	fs = require('fs');
var cheerio = require("cheerio");
// var wrench = require("wrench");
// var readdirp = require('readdirp');
var models = require('../models');

// wrench.readdirRecursive("htmls", function (error, files) {
// 	console.log(files)

// 	// files.forEach(function(file) {
// 	// 	var $ = cheerio.load(file);
// 	// 	var imgsrc = $('div .photo-1').find('img').attr('src');
// 	// 	console.log("imgsrc=======>"+imgsrc);
// 	// })
// });

// readdirp({ root: './htmls', fileFilter: '*.html' })
//   .on('data', function (entry) {
//   	// var $ = cheerio.load('<h1></h1>');
//   	var $ = cheerio.load('<ul id="fruits">...</ul>');
//   	console.log($)
// 	var imgsrc = $('.photo-1').find('img').eq(0).attr('src');
// 	console.log("imgsrc=======>"+imgsrc);
//   });


  var http = require("http");

   // Utility function that downloads a URL and invokes
   // callback with the data.
  function download(url, callback) {
  	http.get(url, function(res) {
  		var data = "";
  		res.on('data', function(chunk) {
  			data += chunk;
  		});
  		res.on("end", function() {
  			callback(data);
  		});
  	}).on("error", function() {
  		callback(null);
  	});
  }
  models.Restaurant.find({city_id: '516a34f958e3511036000001', show_flag: false}, function(err, restaurants) {
  	if(err) {console.log("error is " + err)}
	  restaurants.forEach(function(res, index) {
		var time = index * 500
		setTimeout(function() {
			download(res.url, function(data) {
				if (data) {

					var $ = cheerio.load(data);
					var imgsrc = $('.photo-1').find('img').eq(0).attr('src');
					if(imgsrc){
						var imgsrcarr = imgsrc.split('/');
						imgsrcarr.splice(5, 1, 'l.jpg');
						var newimgsrc = '';
						// imgsrcarr.forEach(function(i) {
						// 	newimgsrc += '/' + i;
						// })
						for (var i = 0; i < imgsrcarr.length; i++) {
							if (i == 0) {
								newimgsrc += imgsrcarr[0]
							} else {
								newimgsrc += '/' + imgsrcarr[i]
							}
						}
						res.show_flag = true;
						res.save(function(err, result) {
							if (err) {
								console.log('error is  ' + err)
							} else {
								request(newimgsrc).pipe(fs.createWriteStream(res.cover_image))
								console.log('time and url==>>, ' + time + ' ' + newimgsrc);
								console.log('yelp url ====>' + res.url)
								console.log('download image of ' + res.name + ' success');
							}
						});
					}
				} else console.log("error");
			})
		}, time);
	  })
  })