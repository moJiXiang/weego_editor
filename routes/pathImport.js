var Attractions = require('./attractions');
var Restaurant = require('../proxy/restaurant');
var Shopping = require('../proxy/shopping');
var EventProxy = require('eventproxy');
var Path = require('../proxy/Path');
var ObjectID = require('mongodb').ObjectID;
var Path = require('../proxy/path');
var sleep = require('sleep');

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
		title = 'result';
	}
	var items = require('../data/path/'+title).items;
	// var n = items.length * (items.length-1);
	var n = items.length;
	var ep = new EventProxy();
	ep.after('save',n,function(list){
		// console.log(list);
		console.log('success!');
		res.send(list);
	}).fail(function(err){
		console.log(err);
	});
	for(var i=0;i<items.length;i++){
		(function(k){
			for(var j=0;j<items.length;j++){
				var epx = new EventProxy();
				epx.after('a'+k,items.length-1,function(list){
					ep.emit('save',list);
				}).fail(function(err){
					console.log(err);
				});
				if(k!=j){
					var one = {};
					one.city_id = newyork;
					one.city_name = items[k].city_name;
					one.a_id = items[k]._id;
					one.a_latitude = items[k].latitude;
					one.a_longitude = items[k].longitude;
					one.a_type = items[k].type;
					one.b_id = items[j]._id;
					one.b_latitude = items[j].latitude;
					one.b_longitude = items[j].longitude;
					one.b_type = items[j].type;
					saveOnePath(one,ep.done('a'+k));
					sleep.usleep(10);
				}
			}
		})(i);
		console.log('i = '+i);
		sleep.sleep(10);
	}
	console.log(items.length);
};

function saveOnePath(one,callback){
	Path.newAndSave(one,callback);
}
