var barcelona = require('../data/life/barcelona_data'); //ID:516a3519f8a6461636000003,巴塞罗那
var geneva = require('../data/life/geneva_data'); //ID:516a35218902ca1936000003,日内瓦
var london = require('../data/life/london_data'); //ID:516a35218902ca1936000005,伦敦
var losangeles = require('../data/life/losangeles_data');//ID:516a34f958e3511036000003,洛杉矶
var newyork = require('../data/life/newyork_data'); //ID:516a34f958e3511036000001,纽约
var paris = require('../data/life/paris_data');//ID:516a350ec221c21236000003,巴黎
var roma = require('../data/life/roma_data');//ID:51d3d238e98bbb566a000001,罗马
var sanfrancisco = require('../data/life/sanfrancisco_data');//ID:516a34f958e3511036000002,旧金山
var singapore = require('../data/life/singapore_data');//ID:516a3535dac6182136000004,新加坡
var zurich = require('../data/life/zurich_data'); //ID:516a35218902ca1936000002,苏黎世

var CategoryR = require('../data/life/category_restaurant');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var EventProxy = require('eventproxy');
var Restaurant = require('../proxy').Restaurant;
var RestaurantModel = require('../models').Restaurant;
var Category = require('../proxy').Category;
var count=0;

function getInitData(){
	var cityItems = [];
	//cityItems.push({cityname:'巴塞罗那',cityid:'516a3519f8a6461636000003',items:barcelona.items});
	 // cityItems.push({cityname:'日内瓦',cityid:'516a35218902ca1936000003',items:geneva.items});
	// cityItems.push({cityname:'伦敦',cityid:'516a35218902ca1936000005',items:london.items});
	// cityItems.push({cityname:'洛杉矶',cityid:'516a34f958e3511036000003',items:losangeles.items});
	cityItems.push({cityname:'纽约',cityid:'516a34f958e3511036000001',items:newyork.items});
	// cityItems.push({cityname:'巴黎',cityid:'516a350ec221c21236000003',items:paris.items});
	// cityItems.push({cityname:'罗马',cityid:'51d3d238e98bbb566a000001',items:roma.items});
	// cityItems.push({cityname:'旧金山',cityid:'516a34f958e3511036000002',items:sanfrancisco.items});
	// cityItems.push({cityname:'新加坡',cityid:'516a3535dac6182136000004',items:singapore.items});
	// cityItems.push({cityname:'苏黎世',cityid:'516a35218902ca1936000002',items:zurich.items});
	return cityItems;
}

exports.initCategoryData = function(){
	Category.getCategorysByType('1',function(err,categorys){
		if(categorys){
			global.categorys = categorys;
			console.log('global.categorys='+global.categorys.length);
		}
	});
}

exports.importCategoryRestaurantData = function(req,res){
	var items = CategoryR.items;
	var flag = req.query.flag;
	if(flag){
		for(var i=0;i<items.length;i++){
			(function(k){
				var item = items[k];
				Category.newAndSave('1',item.cn_name,item.name,function(){
					console.log(k+' over!');
				});
			})(i);
		}
	}
	else{
		res.end();
	}
};

exports.importLifeData = function(req,res){
	var flag = req.query.flag;
	if(flag){
		var cityItems = getInitData();
		var ep = new EventProxy();
	    ep.bind('error', function (err) {
	        ep.unbind();// 卸载掉所有handler
	        callback(err);// 异常回调
	    });
	    console.log('--------'+cityItems.length);
	    ep.after('getFull', cityItems.length, function (list) {
	        // callback(null,list);
	        // var c = [];
	        // for(var i=0;i<list.length;i++){
	        // 	c = c.concat(list[i]); 
	        // }
	        // writeImgFile(c);
	        res.send(list.length);
	    });
	    for(var i=0;i<cityItems.length;i++){
	        importOne(cityItems[i],ep.group('getFull'));
	    }

	}else{
		console.log('flag is null');
	}
};

function writeImgFile(obj){
	fs.appendFileSync('c:/images.js', JSON.stringify(obj),[], function (err) {
	  if (err) throw err;
	  console.log('The "data to append" was appended to file!');
	});
} 

var importOne = function(one, callback){
	var cityid = one.cityid;
	var cityname = one.cityname;
	var items = one.items;
	var images = [];
	var ep = new EventProxy();
	ep.bind('error', function (err) {
        ep.unbind();// 卸载掉所有handler
        console.log("you wenti !");
        callback(err);// 异常回调
    });

    ep.after('getAll', items.length, function (list) {
    	console.log(items.length);
        callback(null,images);
    });


	for(var i=0;i<items.length;i++){
		(function(k){
			var item = items[k]
			var categorystrlist = item.categorystrlist;
			if(isNotNull(item.ogtitle)){
				var restaurant = new RestaurantModel();
				restaurant.name = item.ogtitle;
				restaurant.city_id = cityid;
				restaurant.city_name = cityname;
				restaurant.ranking = (k+1);
				if(item.placelocationlongitude && item.placelocationlatitude){
					restaurant.longitude = item.placelocationlongitude;
					restaurant.latitude = item.placelocationlatitude;
				}
				if(isNotNull(item.categorystrlist)){
					restaurant.category = getCategory(item.categorystrlist);
				}

				if(isNotNull(item.ogimage)){
					var fileName = getImageFileName(item.ogimage);
					var image = {
						fileName:fileName,
						image:item.ogimage
					}
					images.push(image);
					restaurant.cover_image = fileName;
					restaurant.image.push(fileName);
					writeImgFile(image);
				}

				if(isNotNull(item.ogdescription)){
					restaurant.introduce = item.ogdescription;
				}

				if(isNotNull(item.address)){
					restaurant.address = replaceBR(item.address);
				}

				if(isNotNull(item.postalcode)){
					restaurant.postal_code = item.postalcode;
				}

				if(isNotNull(item.telephone)){
					restaurant.tel = item.telephone;
				}

				if(isNotNull(item.website)){
					restaurant.website = item.website;
				}

				if(isNotNull(item.avgprice)){
					restaurant.price_desc = getPriceDesc(item.avgprice)
				}
				if(isNotNull(item.pricelevel)){
					restaurant.price_level = getPriceLevel(item.pricelevel);
				}
				
				if(isNotNull(item.hours) && item.hours.length!=0){
					restaurant.open_time = getOpenTime(item.hours);
				}

				if(!isEmptyObject(item.businessinfos)){
					restaurant.info = getInfo(item.businessinfos);
				}

				if(isNotNull(item.rating)){
					restaurant.rating = parseFloat(item.rating);
				}

				if(isNotNull(item.reviewcount)){
					restaurant.reviews = parseInt(item.reviewcount);
				}

				if(isNotNull(item.reviewcomment)){
					restaurant.comments.push(item.reviewcomment);
				}

				if(isNotNull(item.ogurl)){
					restaurant.url = item.ogurl;
				}

				restaurant.save(function(err){
					// console.log(restaurant);
					// console.log(++count+' over!');
					return ep.emit('getAll');
				});
			}
		})(i);
		
	}
};

function isNotNull(str){
	if(str && str!='null' && str!='undefined')
		return true;
	else
		return false;
}

function isEmptyObject(obj){
	if(obj==null || obj==undefined)
		return true;
	else
		return Object.keys(obj).length?false:true;
}

function getImageFileName(url) {
    var suffix = url.split('.');
    var _id = new ObjectID();
    return  _id + '.' + suffix[suffix.length-1];
}

function getPriceDesc(avgprice){
	avgprice = trim(avgprice);
	if(avgprice=='Pricey')
		return '比较贵';
	else if(avgprice=='Moderate')
		return '一般';
	else if(avgprice=='Inexpensive')
		return '比较便宜';
	else
		return avgprice;
}

function getPriceLevel(pricelevel){
	pricelevel = trim(pricelevel);
	if(pricelevel=='$')
		return 1;
	else if(pricelevel=='$$')
		return 2;
	else if(pricelevel=='$$$')
		return 3;
	else
		return 4;
}


function getOpenTime(open_time){
	var rt = [];
	open_time = delOpenNow(open_time);
	for(var i=0;i<open_time.length;i++){
		var item = open_time[i];
		var x = getWeek(i,item);
		var a = {
			desc : x.desc,
			value: x.value
		};
		rt.push(a);
	}
	return rt;
}

function delOpenNow(open_time){
	var rt = [];
	var staticP = '';
	for(var i=0;i<open_time.length;i++){
		if(open_time[i]!="Open now" && open_time[i]!="Closed"){
			staticP = open_time[i];
			break;
		}
	}
	console.log(staticP);
	for(var i=0;i<open_time.length;i++){
		var item = open_time[i];
		if(item=='Open now'){
			item = staticP;
		}
		rt.push(item);
	}
	return rt;
}

function getWeek(i,item){
	var desc = '';
	var value = '';
	if(item=='Closed'){
		desc = '关门';
		value = 'close-close';
	}
	else{
		var a = item.split('-');
		if(a.length<2){
			desc = '关门';
			value = 'close-close';
		}
		else{
			desc = a[0] + '-'+a[a.length-1];
			value = getAmPmData(a[0]) + '-' + getAmPmData(a[a.length-1]);
		}	
	}

	if(i==0)
		return {desc:"周一 "+desc,value:'1-'+value}
	else if(i==1)
		return {desc:"周二 "+desc,value:'2-'+value} 
	else if(i==2)
		return {desc:"周三 "+desc,value:'3-'+value} 
	else if(i==3)
		return {desc:"周四 "+desc,value:'4-'+value} 
	else if(i==4)
		return {desc:"周五 "+desc,value:'5-'+value} 
	else if(i==5)
		return {desc:"周六 "+desc,value:'6-'+value} 
	else 
		return {desc:"周日 "+desc,value:'7-'+value} 
}

function getAmPmData(amOrpm){
	amOrpm = trim(amOrpm);
	var a = amOrpm.split(' ');
	if(a[0]){
		var b = a[0].split(':');
		var data = '';
		if(a[1]=='pm'){
			data = parseInt(b[0]) + 12;
		}else{
			data = b[0];
		}
		
		if(b[1]=='30')
			data += '.5';
	}
	return data;
} 

function getInfo(businessinfos){
	var info = {};
	if(businessinfos["Takes Reservations"] && businessinfos["Takes Reservations"]=='Yes'){
		info.yu_ding = true;
	}
	if(businessinfos["Take-out"] && businessinfos["Take-out"]=='Yes'){
		info.take_out = true;
	}

	if(businessinfos["Accepts Credit Cards"] && businessinfos["Accepts Credit Cards"]=='Yes'){
		info.card = true;
	}

	if(businessinfos["Good For"]){
		info.g_for = businessinfos["Good for"];
	}

	if(businessinfos["Good for Kids"] && businessinfos["Good for Kids"]=='Yes'){
		info.g_f_kid = true;
	}

	if(businessinfos["Good for Groups"] && businessinfos["Good for Groups"]=='Yes'){
		info.g_f_group = true;
	}

	if(businessinfos["Noise Level"]){
		info.noise = businessinfos["Noise Level"];
	}

	if(businessinfos["Wi-Fi"] && businessinfos["Wi-Fi"]=='Yes'){
		info.wi_fi = true;
	}

	if(businessinfos["Has TV"] && businessinfos["Has TV"]=='Yes'){
		info.tv = true;
	}

	if(businessinfos["Waiter Service"] && businessinfos["Waiter Service"]=='Yes'){
		info.waiter = true;
	}

	if(businessinfos.Delivery && businessinfos.Delivery=='Yes'){
		info.delivery = true;
	}
	
	if(businessinfos.Alcohol){
		info.alcohol = businessinfos.Alcohol;
	}

	if(businessinfos["Outdoor Seating"] && businessinfos["Outdoor Seating"]=='Yes'){
		info.out_seat = true;
	}

	return info;
}

function getCategory(categorystrlist){
	var a = categorystrlist.split(',');
	var rt = [];
	for(var i=0;i<a.length;i++){
		for(var k=0;k<global.categorys.length;k++){
			var x = global.categorys[k];
			if(trim(a[i])==x.en_name){
				var item = {
					_id:x._id,
					name:x.name
				};
				rt.push(item);
			}
		}
	}
	return rt;
}

// function isRestaurant(categorystrlist){
// 	if(categorystrlist=='' || categorystrlist==null || categorystrlist=='null' || categorystrlist==undefined){
// 		return false;
// 	}
// 	var a = categorystrlist.split(',');
// }

function inArray(a,bArray){
	for(var i=0;i<bArray.length;i++){
		if(a==bArray[i])
			return true;
	}
	return false;
}

function trim(content){  
    // 用正则表达式将前后空格    
    if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(/(^\s+)|(\s+$)/g,"");
}

function replaceN(content){  
    //  },{   },\n{  
    if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(new RegExp('},{',"gm"),'},\n{');
}

function replaceBR(content){
	if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(new RegExp('<br>',"gm"),',');
}