var bangkok = require('../data/result_bangkok');
var barcelona = require('../data/result_Barcelona');
var geneva = require('../data/result_geneva');
var kyoto = require('../data/result_kyoto');
var london = require('../data/result_london');
var LosAngeles = require('../data/result_LosAngeles');
var newyork = require('../data/result_newyork');
var osaka = require('../data/result_osaka');
var paris = require('../data/result_paris');
var rome = require('../data/result_rome');
var sanfrancisco = require('../data/result_sanfrancisco');
var seoul = require('../data/result_seoul');
var tokyo = require('../data/result_tokyo');
var venice = require('../data/result_venice');
var zurich = require('../data/result_zurich');
require('../config/Config');
var AttractionsProvider = require("../config/AttractionsProvider").AttractionsProvider;
var attractionsProvider = new AttractionsProvider();
var Attractions = require('./attractions');

exports.importCity = function(req,res){
	var flag = req.query.flag;
	if(flag){
		var cityItems = getInitData();
		for(var j=0;j<cityItems.length;j++){
			var items = cityItems[j].items;
			var cityname = cityItems[j].cityname;
			Attractions.getAttractionsByQuery({cityname:cityname},{},function(err,attractions){
				if(attractions){
					console.log(attractions.length);
					for(var i=0;i<attractions.length;i++){
						var attraction = attractions[i];
						for(var k=0;k<items.length;k++){
							if(attraction.attractions_en == trim(items[k].name)){
								console.log('found!');
							}
						}
					}
				}
			});
		}

	}else{
		console.log('flag is null');
	}
};

function getInitData(){
	var cityItems = [];
	cityItems.push({cityname:'曼谷',items:bangkok.items});
	cityItems.push({cityname:'巴塞罗那',items:barcelona.items});
	cityItems.push({cityname:'日内瓦',items:geneva.items});
	cityItems.push({cityname:'京都',items:kyoto.items});
	cityItems.push({cityname:'伦敦',items:london.items});
	cityItems.push({cityname:'洛杉矶',items:LosAngeles.items});
	cityItems.push({cityname:'纽约',items:newyork.items});
	cityItems.push({cityname:'大阪',items:osaka.items});
	cityItems.push({cityname:'巴黎',items:paris.items});
	cityItems.push({cityname:'罗马',items:rome.items});
	cityItems.push({cityname:'旧金山',items:sanfrancisco.items});
	cityItems.push({cityname:'首尔',items:seoul.items});
	cityItems.push({cityname:'东京',items:tokyo.items});
	cityItems.push({cityname:'威尼斯',items:venice.items});
	cityItems.push({cityname:'苏黎世',items:zurich.items});
	return cityItems;
}

function trim(str){  
	if(str)
	    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
	else
		return '';
}
// var name = '  asdf   saefas   ';
// console.log(trim(name));