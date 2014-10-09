var async  = require('async'),
    config = require('../config/Config'),
	request = require('request'),
	fs = require('fs');
var models = require('../models');
var gm = require('gm')
,   imageMagick = gm.subClass({ imageMagick: true });

var ids = ['516a34f958e3511036000001','516a34f958e3511036000002','516a34f958e3511036000003'];
// models.City.find({'_id':{$in:ids}}, function(err, cities) {
// 	var imgs = cities.map(function(c) {
// 		return c.coverImageName;
// 	})
// 	console.log(imgs)
// 	fs.readdir('./origin', function(err, files) {
// 		console.log(files);
// 		files.forEach(function(f) {
// 			imgs.forEach(function(i) {
// 				if(f == i) {
// 					// fs.readFile('./origin/' + i, function(err, data) {
// 						if (err) throw err;
// 						imageMagick('./origin/' + i)
// 						.resize(640)
// 						.crop(640, 480)
// 						.write('./cities/' + f, function(err) {
// 							if(err) throw err;
// 						})
// 					// });
// 				}
// 			})
// 		})
// 	})
// })
// models.City.find({'_id':{$in:ids}}, function(err, cities) {

// var imgs = cities.map(function(c) {
// 		return c.imgforapp;
// 	})
// 	console.log(imgs)
// 	fs.readdir('./origin', function(err, files) {
// 		console.log(files);
// 		files.forEach(function(f) {
// 			imgs.forEach(function(i) {
// 				if(f == i) {
// 					// fs.readFile('./origin/' + i, function(err, data) {
// 						if (err) throw err;
// 						imageMagick('./origin/' + i)
// 						// .resize(640)
// 						// .chop(640, 1136)
// 						// .type("TrueColor")
// 						// .noProfile()
// 						// .quality(30)
// 						.compress("JPEG")
// 						.autoOrient()
// 						.write('./cities/' + f, function(err) {
// 							if(err) throw err;
// 						})
// 					// });
// 				}
// 			})
// 		})

// })

// })


// models.Restaurant.find({'city_id':{$in:ids}}, function(err, restaurants) {

// var imgs = restaurants.map(function(c) {
// 		return c.cover_image;
// 	})
// 	console.log(imgs)
// 	fs.readdir('./res/origin', function(err, files) {
// 		console.log(files);
// 		files.forEach(function(f) {
// 			imgs.forEach(function(i) {
// 				if(f == i) {
// 					// fs.readFile('./origin/' + i, function(err, data) {
// 						if (err) throw err;
// 						imageMagick('./res/origin/' + i)
// 						.resize(640)
// 						.crop(640, 480)
// 						// .type("TrueColor")
// 						// .noProfile()
// 						// .quality(30)
// 						// .compress("JPEG")
// 						.autoOrient()
// 						.write('./res/' + f, function(err) {
// 							if(err) throw err;
// 						})
// 					// });
// 				}
// 			})
// 		})

// })

// })

// models.Attraction.find({'city_id':{$in:ids}}, function(err, attractions) {

// var fileList = attractions.map(function(c) {
// 		return c.coverImageName;
// 	})

// console.log(fileList)
// var chunkSize = 50; // 100 was too many. Choked every time at 80 or 81.
// (function loop(i){

//   var filename = fileList[i];
//   //console.log('processing... ', filename);
//   if(filename){

  
//   imageMagick('./attr/origin/' + filename)
// 		.resize(640)
// 		.crop(640, 480)
// 		.autoOrient()
// 		.write('./attrs/' + filename, function(err) {
// 			if(err) console.log(err);
// 		})

//   i++;
//   if(i == fileList.length) return; // we're done.
//   if(i%chunkSize == 0){
//     setTimeout(function(){ loop(i); }, 2000);
//   } else {
//     loop(i);
//   }
// } else {
// 	i++;
// 	if(i == fileList.length) return; // we're done.
// 	  if(i%chunkSize == 0){
// 	    setTimeout(function(){ loop(i); }, 2000);
// 	  } else {
// 	    loop(i);
// 	  }
// }
// })(0);
// })

// models.Restaurant.find({'city_id':{$in:ids}}, function(err, res) {

// var fileList = res.map(function(c) {
// 		return c.cover_image;
// 	})

// console.log(fileList)
// var chunkSize = 50; // 100 was too many. Choked every time at 80 or 81.
// (function loop(i){

//   var filename = fileList[i];
//   //console.log('processing... ', filename);
//   if(filename){

  
//   imageMagick('./res/origin/' + filename)
// 		.resize(640)
// 		.crop(640, 480)
// 		.autoOrient()
// 		.write('./resall/' + filename, function(err) {
// 			if(err) console.log(err);
// 		})

//   i++;
//   if(i == fileList.length) return; // we're done.
//   if(i%chunkSize == 0){
//     setTimeout(function(){ loop(i); }, 2000);
//   } else {
//     loop(i);
//   }
// } else {
// 	i++;
// 	if(i == fileList.length) return; // we're done.
// 	  if(i%chunkSize == 0){
// 	    setTimeout(function(){ loop(i); }, 2000);
// 	  } else {
// 	    loop(i);
// 	  }
// }
// })(0);
// })

models.Area.find({'city_id':{$in:ids}}, function(err, res) {

var fileList = res.map(function(c) {
		return c.cover_image;
	})

console.log(fileList)
var chunkSize = 50; // 100 was too many. Choked every time at 80 or 81.
(function loop(i){

  var filename = fileList[i];
  //console.log('processing... ', filename);
  if(filename){

  
  imageMagick('./area/origin/' + filename)
		.resize(640)
		.crop(640, 480)
		.autoOrient()
		.write('./areas/' + filename, function(err) {
			if(err) console.log(err);
		})

  i++;
  if(i == fileList.length) return; // we're done.
  if(i%chunkSize == 0){
    setTimeout(function(){ loop(i); }, 2000);
  } else {
    loop(i);
  }
} else {
	i++;
	if(i == fileList.length) return; // we're done.
	  if(i%chunkSize == 0){
	    setTimeout(function(){ loop(i); }, 2000);
	  } else {
	    loop(i);
	  }
}
})(0);
})

