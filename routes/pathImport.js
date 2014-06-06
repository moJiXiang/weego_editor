var Attractions = require('./attractions');
var Restaurant = require('../proxy/restaurant');
var Shopping = require('../proxy/shopping');
var EventProxy = require('eventproxy');
var Path = require('../proxy/path');
var ObjectID = require('mongodb').ObjectID;
var PathsModel = require('../models').Path;
var sleep = require('sleep');


var https = require('https');


var barcelona = '516a3519f8a6461636000003';
var geneva = '516a35218902ca1936000003';
var london = '516a35218902ca1936000005';
var losangeles = '516a34f958e3511036000003';
var newyork = '516a34f958e3511036000001';
var paris = '516a350ec221c21236000003';
var roma = '51d3d238e98bbb566a000001';
var sanfrancisco = '516a34f958e3511036000002';
var singapore = '516a3535dac6182136000004';
var zurich = '516a35218902ca1936000002';
var venezia = '516a3519f8a6461636000001';


var googlekeys = [
				'AIzaSyDMRyBL9sn1vA3MbjDtX4W54Si-vXmVI9I',
				'AIzaSyAZLPKceML58HmRhUilEAJk7eVzX-YWvDk',
				'AIzaSyC3C4H0cmeDg_zsdClUmTHZawfX4ud0KJg',
				'AIzaSyBs_-L-SJd6jRs1lDg7or9ML9-f6qSyJPY',
				'AIzaSyD2yN3H6AZo2ZRVV1TKE1Qgjwp_aihXgIg',
				'AIzaSyBE6jCDCiCYiiWte8mHU2eCWRpnesg9wi0',
				'AIzaSyB8k898ceQQQRP8E7d6MGV7uR70SjglIRs',
				'AIzaSyAAqiB8LKdAO2TFce938JhYxRzV5iocYnA',
				'AIzaSyBWdhuY4bvEvpXFUXmd0f-CVPI7bPeDIrI',
				'AIzaSyAyB1quLjB8AQJX7uIFI4CccScGtIQo_Iw',
				'AIzaSyDXZs4uH6GfJvty_d5lxSdAYOIGni4ONpA',
				'AIzaSyD3bSBcHxhXnbGNmOMyZIq0yZQKT5SK5vE',
				'AIzaSyA6VApU2NvCe6_vXP-uUVR3tp7tytXmktk',
				'AIzaSyCxbK33U4sc03RiMYvbGjv842fu3CauQMw',
				'AIzaSyBBZ5PfjvzlJmnJP6UOZwulnXkUka10jtU',
				'AIzaSyAQlkUmxuKywJhQHjhPeNqHq64x4GYboxU',
				'AIzaSyCfxoIPMR1XCX7oKQYHJUq1v7sJnIBU5Zo',
				'AIzaSyA7hNXWKhdQAsdJrA382YqdfwHdGOD4ERQ',
				'AIzaSyD0iTaXf4_7iwV-XwHHAR7G-NtegrOfJn0',
				'AIzaSyBfgNQ9uBdEgUaWBJQhupDVb37D8s5aIzQ',
				'AIzaSyB_vWuGUWaWWhktecHv4B4nz3aTNRjEx80',
				'AIzaSyBvZC8G3vNfydxNvgYRckIy26LdlndyMGM',
				'AIzaSyBisf0JQtCzfdE05v0J0hTUc3j89jjylWA',
				'AIzaSyC-8sfK-tKRyklKblFh8snjK3vLY2AVigE',
				'AIzaSyCH0q4aMCz2eQ5Tj7Z4JNUx5uBmEZ9kihA',
				'AIzaSyBXm-NF0xvl8wx2ocwTwXHjMFbd8D9ueLw',
				'AIzaSyAA9NumbHg8GdK96n5TPTqMQy3OIR4iFyo',
				'AIzaSyDPRuJ-PmFsLSVfxKHaW9PsGSeA-66rNoM',
				'AIzaSyAnCYbcREUmuRAXBWUuL0JnMP7i7CrfheI',
				'AIzaSyD3O6ABYrLRre-QKA5Bdbt35vPq_YbW9lE',
				'AIzaSyBycWZrgBNQnEzE_vVfgxKFjFDATDHf2og',
				'AIzaSyDJMz-7kjoFzd4EOGR3jCNGm5YTBoKkpjQ',
				'AIzaSyDYs6QWLjsqKZQnLzqJ7JxJH3Jw86kW6B0',
				'AIzaSyAIEE5W7GM1YswUlvV48gaawyfKcskm6fc',
				'AIzaSyBkJ5t2FylyMjcpnrkRY3Uc6f1WcukGmT0',
				'AIzaSyCtDXhHniJwtFu_F7v6PqjvHexYTbEF8jE',
				'AIzaSyC6mxhY7rOAd5fHRP6dO0fsALspXuSc8gQ',
				'AIzaSyAF2xScNQAFy6M3VDtTeDnADFKtdBMgl4k',
				'AIzaSyDn9wF2qFiY1HgY8LtgofaGPwPOiAtRMvI',
				'AIzaSyAyKDuReoMLdLBE_XMGO2BH4SGbbg8FFtQ',
				'AIzaSyCn9yXrxzi6l_7fgTaLc-vQK8JHQ1LPjyI',
				'AIzaSyB-2rd2RgBCJju0UzxamXnHv1hjsuzrmwM',
				'AIzaSyAZzr2ecgrTpGgR0X3DjM5xA9Gm1GCNyBw',
				'AIzaSyCtWmc3PF3q5eWcuKbYCUkjWOuZswaRe8s',
				'AIzaSyCY_4rtlHUr5nqVVQ--JYQ-iGQtkYc8Ja4',
				'AIzaSyBFyW9Zdinf2uKmEk1qYX0v3UGGx1T43N4',
				'AIzaSyAJjDj1sKSr0bnSasC3Kg9RfMXgNy0HjjM',
				'AIzaSyB27RMIbvGq3k72zSpb00pmqPko6OdhAn0',
				'AIzaSyAeRZkpdOlqX84NlQB8Fnp0uP2H6yGeTk8',
				'AIzaSyBizR_t7aWKw_aPZYyWzyhgA7dPTXa9wRY',
				'AIzaSyC1_u_aVAtmDt4k4hnMa-lybRGZxvgdrKI',
				'AIzaSyD4FR4fDEzcLDTyjwec0fBKaWfWFsy-X_Q',
				'AIzaSyCHai-NovQ7Axn63YsjkUMxGlr-NwHrKtU',
				'AIzaSyABE3vZJlZ4wVvR5FE_K_tUjcFI3v21HX0',
				'AIzaSyAW6v4iyX9Jp-E1F3YfqT8BWsd-ibszkNc',
				'AIzaSyA0ZJg4_K2mhuxCEBQTausY2UsNICvgCiI',
				'AIzaSyCxqSH8D3txfFhlpn5JIBCSF-kF7juO6LQ',
				'AIzaSyBXTo2WAvdiH245bxuSJi-XD7Qbq4XSvuE',
				'AIzaSyCaPB2HJULy_fcf3nIWRfI7_0OOUi-98T8',
				'AIzaSyDAKIT7fqfoYfLNtMXxWMI_ru-TofF46Rs',
				'AIzaSyBJ37BTXWsyAVhVpp6yUeZWLO_1UEU4EXo',
				'AIzaSyCGKBoEkQBGm04AwYCZ46X_uAUICJuDSRI',
				'AIzaSyDNMCIMaOJoieVJ_mZRk5Nolz7QKxG6BTE'
				];

exports.saveSpotToText = function(req,res){
	var title = req.query.title;
	var ep = new EventProxy();
	ep.all('att','rest','shop', function (att, rest,shop) {
		// console.log(att.length);
		// console.log(rest.length);
		// console.log(shop.length);
		var attStr = [];
		for(var i=0;i<att.length;i++){
		  attStr.push({_id:att[i]._id,type:'0',city_name:att[i].cityname,latitude:att[i].latitude,longitude:att[i].longitude});
		}
		var restStr = [];
		for(var i=0;i<rest.length;i++){
			restStr.push({_id:rest[i]._id,type:'1',city_name:rest[i].city_name,latitude:rest[i].latitude,longitude:rest[i].longitude});
		}
		var shopStr = [];
		for(var i=0;i<shop.length;i++){
			shopStr.push({_id:shop[i]._id,type:'2',city_name:shop[i].city_name,latitude:shop[i].latitude,longitude:shop[i].longitude});
		}
		var logStr = 'exports.items=' + JSON.stringify(attStr.concat(restStr).concat(shopStr));
		logStr += ';';
		if(!title)
			title = 'result';
		fs.appendFileSync('./data/path/'+title+'.js', logStr,[], function (err) {
		  if (err) throw err;
		  console.log('The "data to append" was appended to file!');
		  res.send('ok! file = /data/path'+title+'.js');
		});
    
  }).fail(function(err){
  	console.log(err);
  });
  Attractions.getAttractionsByQuery({cityid:newyork},{cityname:1,latitude:1,longitude:1,},ep.done('att'));
  Restaurant.getRestaurantsByOptions({city_id:new ObjectID(newyork)},{city_name:1,latitude:1,longitude:1},ep.done('rest'));
  Shopping.getShoppingsByOptions({city_id:new ObjectID(newyork)},{city_name:1,latitude:1,longitude:1},ep.done('shop'));
};

exports.importPathToDB = function(req,res){
	var title = req.query.title;
	if(!title){
		title = 're';
	}
	var items = require('../data/path/core/' + title).items;
	var n = items.length * (items.length-1);


	var itemss = require('../data/path/core/' + title + 'res').items;

	var ep = new EventProxy();
	ep.after('save',n,function(list){
		// console.log(list);
		console.log('success!');
	}).fail(function(err){
		console.log(err);
	});
	for(var i=0;i<items.length;i++){
		for(var j=0;j<itemss.length;j++){
			if(true){
				var one = {};
				one.city_id = newyork;
				one.city_name = items[i].city_name;
				one.a_id = items[i]._id;
				one.a_latitude = items[i].latitude;
				one.a_longitude = items[i].longitude;
				one.a_type = items[i].type;
				one.b_id = itemss[j]._id;
				one.b_latitude = itemss[j].latitude;
				one.b_longitude = itemss[j].longitude;
				one.b_type = itemss[j].type;
				saveOnePath(one,ep.done('save'));
				sleep.usleep(600);
				console.log(i + ':' + j);
			}
		}
	}
	console.log(items.length);
};


exports.importPathToDBSync = function(req, res) {
	var title = req.query.title;
	if(!title){
		title = 'result';
	}
	var items = require('../data/path/'+title).items;
	var n = items.length * (items.length-1);
	for(var i=0;i<items.length;i++){
		for(var j=0;j<items.length;j++){
			if(i!=j){
				var one = {};
				one.city_id = newyork;
				one.city_name = items[i].city_name;
				one.a_id = items[i]._id;
				one.a_latitude = items[i].latitude;
				one.a_longitude = items[i].longitude;
				one.a_type = items[i].type;
				one.b_id = items[j]._id;
				one.b_latitude = items[j].latitude;
				one.b_longitude = items[j].longitude;
				one.b_type = items[j].type;
				saveOnePath(one, function(err, data) {
					if (err) {
						console.log(err);
					} else {
						console.log(i + ':' + j);
					}
				});
				sleep.usleep(1000);
				
			}
		}
	}
	//console.log(items.length);
};







function saveOnePath(one,callback){
	Path.newAndSave(one,callback);
}

function getOneEmptyPath (mode, callback) {
	Path.getOneWithEmptySteps(mode, callback);
}

function getOneEmptyPathSync(mode, skip, limit, callback) {
	Path.getOneWithEmptyStepsSync(mode, skip, limit, callback);
}



var https = require('https');

var apiurl = 'https://maps.googleapis.com/maps/api/directions/json';

function getGoogleUrl(o, d, mode, sensor, key) {
	var url = apiurl;
	url += "?origin=" + o;
	url += "&destination=" + d;
	url += "&mode=" + mode;
	var departure_time = Math.round(new Date().getTime()/1000);
	url += "&departure_time=" + departure_time;
	url += "&sensor=" + sensor;
	url += "&key=" + key;
	return url;
}

function mydownload(url, obj, index, count, callback) {
	var req = https.request(url, function(res) {
	  // console.log("statusCode: ", res.statusCode);
	  // console.log("headers: ", res.headers);
	  var data = "";
	  res.on('data', function(d) {
	  	data += d;
	    // process.stdout.write(d);
	    if(data.length > 100000000)
        res.emit('end');

	  });
	  res.on("end", function() {
	  	callback(null, data, obj, index, count);
	  });

	});
	req.end();

	req.on('error', function(e) {
	  console.log('error');
	  callback(null);
	});
}


exports.autoReloadPage = function (req, res) {

	sleep.sleep(4);
	var achangekey = false;
	achangekey = true;
	res.render("index", {test:"hello,world", url : "aaaa", changekey : achangekey});
}

exports.runFillTaskQueen = function(req, res) {
	
	var mode = req.query.mode;
	var kk = req.query.key;
	var googlekey = googlekeys[kk];
	var skip = req.query.skip;
	var limit = req.query.limit;

	var changekey = false;
	
	getOneEmptyPathSync(mode, skip, limit, function(err, data) {
		if (err) {
			res.send(err);
		} else {
			if (!data) {
				//stop the request google
				res.send("no data");

			} else {
				// res.send(data);
				//fetch google maps api
				var epcount = data.length;

				// res.send(data);


				// var ep = new EventProxy();
				// ep.after('save', epcount, function(list){
				// 	console.log(list);
				// 	console.log('save success!');
				// }).fail(function(err){
				// 	console.log(err);
				// });

				for (var i = 0; i < epcount; i ++) {

					(function(k) {

						var o = data[k].a_latitude + ',' + data[k].a_longitude;
						var d = data[k].b_latitude + ',' + data[k].b_longitude;
						var one = data[k];


						if (data[k].b_latitude || data[k].b_longitude || data[k].a_latitude || data[k].a_longitude) {

							var googlemode = "transit";
							var sensor = "false";

							var myurl = getGoogleUrl(o, d, googlemode, sensor, googlekey);
							
							console.log('(________' + k + '________)' + myurl);
							
							
							mydownload(myurl, one, k, epcount, function(error, data) {
								if (error) {
									console.log("fetch the google api error, VPN or connection ");
									return;
								} else {
									// console.log(data);
									if (data != undefined) {

										var inner_data = JSON.parse(data);

										if (inner_data.status == "OK") {
											var legs = inner_data.routes[0].legs[0];
											var steps = [];
											steps = legs.steps;
											// for (var mini = 0; mini < legs.steps.length; mini++) {
						     //                   steps.push(getStepObjByGmInfo(legs.steps[mini]));
						     //                   // one.bus.steps.push(getStepObjByGmInfo(legs.steps[mini]));
						     //               	}

											one.bus.steps = steps;

											// console.log(one);

											// saveOnePath(obj, ep.done('save'));
											var path = new PathsModel();
											path.city_id = new ObjectID(one.city_id+'');
											path.city_name = one.city_name;
											path.a_id = new ObjectID(one.a_id+'');
											path.a_type = one.a_type;
											path.b_id = new ObjectID(one.b_id+'');
											path.b_type = one.b_type;
											path.a_latitude = one.a_latitude;
											path.a_longitude = one.a_longitude;
											path.b_latitude = one.b_latitude;
											path.b_longitude = one.b_longitude;
											//steps
											path.bus.steps = one.bus.steps;
											path.driver.steps = one.driver.steps;
											path.walk.steps = one.walk.steps;
											one.save(function(err, one_data){
												if (err) {
													console.log("get the data to database error,fail to read");
												}
												console.log("update success!");
											});
										} else if (inner_data.status == "NOT_FOUND") {


											var steps = [];
											
											console.log(one.id);

											steps.push({ html : "Google Not Found"});

											one.bus.steps = steps;

											// console.log(one);

											// saveOnePath(obj, ep.done('save'));
											var path = new PathsModel();
											path.city_id = new ObjectID(one.city_id+'');
											path.city_name = one.city_name;
											path.a_id = new ObjectID(one.a_id+'');
											path.a_type = one.a_type;
											path.b_id = new ObjectID(one.b_id+'');
											path.b_type = one.b_type;
											path.a_latitude = one.a_latitude;
											path.a_longitude = one.a_longitude;
											path.b_latitude = one.b_latitude;
											path.b_longitude = one.b_longitude;
											//steps
											path.bus.steps = one.bus.steps;
											path.driver.steps = one.driver.steps;
											path.walk.steps = one.walk.steps;
											one.save(function(err, one_data){
												if (err) {
													console.log("get the data to database error,fail to read");
												}
												console.log("Google not found data");
											});



										} else if (inner_data.status == "REQUEST_DENIED") {


											



										} else if (inner_data.status == "ZERO_RESULTS") {



											var steps = [];
											
											console.log(one.id);

											steps.push({ html : "Zero results error"});

											one.bus.steps = steps;

											// console.log(one);

											// saveOnePath(obj, ep.done('save'));
											var path = new PathsModel();
											path.city_id = new ObjectID(one.city_id+'');
											path.city_name = one.city_name;
											path.a_id = new ObjectID(one.a_id+'');
											path.a_type = one.a_type;
											path.b_id = new ObjectID(one.b_id+'');
											path.b_type = one.b_type;
											path.a_latitude = one.a_latitude;
											path.a_longitude = one.a_longitude;
											path.b_latitude = one.b_latitude;
											path.b_longitude = one.b_longitude;
											//steps
											path.bus.steps = one.bus.steps;
											path.driver.steps = one.driver.steps;
											path.walk.steps = one.walk.steps;
											one.save(function(err, one_data){
												if (err) {
													console.log("get the data to database error,fail to read");
												}
												console.log("Google zero results");
											});



											
										} else if (inner_data.status == "OVER_QUERY_LIMIT") {
											changekey = true;
										}
										 else {

											console.log("data error " + inner_data.status);
										}
										if( k == epcount - 1) {

											var redurl = '/runFillTaskQueen?';
											var modee = mode;
											var skipp = skip;
											var limitt = limit;
											var changekeyy = changekey;
											if (changekey) {
												changekey = false;
											}
											res.render('index', {url : redurl, test : "hello,world", changekey : changekeyy, mode : modee, skip : skipp, limit : limitt, key : kk});
										}

									} else {
										console.log("Google maps api error, please stop~");
									}
								}
								



							});
							// sleep.usleep(1000);
							sleep.usleep(10000);

							////////////////


						} else {


							var steps = [];
											
							console.log('geo ' + one.id);


							steps.push({html : "Geo data error"});

							one.bus.steps = steps;

							// console.log(one);

							// saveOnePath(obj, ep.done('save'));
							var path = new PathsModel();
							path.city_id = new ObjectID(one.city_id+'');
							path.city_name = one.city_name;
							path.a_id = new ObjectID(one.a_id+'');
							path.a_type = one.a_type;
							path.b_id = new ObjectID(one.b_id+'');
							path.b_type = one.b_type;
							path.a_latitude = one.a_latitude;
							path.a_longitude = one.a_longitude;
							path.b_latitude = one.b_latitude;
							path.b_longitude = one.b_longitude;
							//steps
							path.bus.steps = one.bus.steps;
							path.driver.steps = one.driver.steps;
							path.walk.steps = one.walk.steps;
							one.save(function(err, one_data){
								if (err) {
									console.log("get the data to database error,fail to read");
								}
								console.log("Error data saved!");
							});






							/////////// geo data error





						}
						

					})(i);
				
				}

			}
		}
	});



	// for (var i = 0; i < 3600; i++) {
	// 	console.log(i + "...");
	// 	sleep.sleep(2);
	// };



	//res.send("pending...");

};

function getStepObjByGmInfo(step){
	var mystep = {};
	mystep.travel_mode = step.travel_mode;
	mystep.duration = step.duration.text;
	mystep.distance = step.distance.text;
	mystep.html = step.html_instructions;
	return mystep;
}


//////////////////////////////////////////分割线
