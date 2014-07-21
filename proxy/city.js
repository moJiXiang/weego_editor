var models     =   require('../models');
var City 	   =   models.City;
var ObjectID = require('mongodb').ObjectID;

exports.update = function (one, callback) {
	var cityname = one.city_name;
	var city_id = one.item_id;
	console.log(city_id);
	// City.findOne({cityname: cityname}, function (err, result) {
	// 	if (result.status) {

	// 		result.attractionscount = one.attractionscount;
	// 		result.restaurantscount = one.restaurantscount;
	// 		result.shopareacount 	= one.shopareacount;
	// 		result.shoppingscount	= one.shoppingscount;
	// 		result.status 			= one.status;
	// 		result.editorname		= one.editorname;
	// 		result.editdate			= one.editdate;
	// 		result.auditorname		= one.auditorname;
	// 		result.auditdate		= one.auditdate;
	// 		result.save();
	// 	}else{
	City.update({
		_id: new ObjectID(city_id)
	}, {
		$set: {
			attractionscount: one.attractionscount,
			restaurantscount: one.restaurantscount,
			shopareacount: one.shopareacount,
			shoppingscount: one.shoppingscount,
			status: one.status,
			editorname: one.editorname,
			editdate: one.editdate,
			auditorname: one.auditorname,
			auditdate: one.auditdate,
		}
	}, callback)
	// 	}
	// });
}

exports.updatemsg = function(one, callback) {

	var city_id = one._id;
	console.log(one);
	City.update({
		_id: new ObjectID(city_id)
	}, {
		$set: {
			// continents          :   one.continents,
	        // continentscode      :   one.continentscode,
	        cityname            :   one.cityname,
	        cityname_en         :   one.cityname_en,
	        cityname_py         :   one.cityname_py,
	        countryname         :   one.countryname,
	        // // countrycode         :   one.countrycode,
	        recommand_day       :   one.recommand_day,
	        recommand_intensity :   one.recommand_intensity,
	        recommand_center    :   one.recommand_center,
	        introduce           :   one.introduce,
	        short_introduce     :   one.short_introduce,
	        restaurant_overview :   one.restaurant_overview,
	        shopping_overview   :   one.shopping_overview,
	        attraction_overview :   one.attraction_overview,
	        tips                :   one.tips,
	        traffic             :   one.traffic,
	        hot_flag            :   one.hot_flag,
	        show_flag           :   one.show_flag,
	        masterLabel         :   one.masterLabel,
	        // subLabel            :   one.subLabel,
	        latitude            :   one.latitude,
	        longitude           :   one.longitude,
	        weoid               :   one.weoid,
	        en_info 			: {
	        	short_introduce : one.en_info.short_introduce,
	        	attraction_overview: one.en_info.attraction_overview,
	        	restaurant_overview: one.en_info.restaurant_overview,
	        	shopping_overview: one.en_info.shopping_overview,
	        	introduce 		: one.en_info.introduce,
	        	tips 			: one.en_info.tips,
	        	traffic 		: one.en_info.traffic
	        }
		}
	},{safe: false, multi: true}, callback)

}