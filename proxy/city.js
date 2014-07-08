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

	City.update({
		_id: new ObjectID(city_id)
	}, {
		$set: {
			continents          :   one.continents,
	        // continentscode      :   one.continentscode,
	        cityname            :   one.cityname,
	        cityname_en         :   one.cityname_en,
	        cityname_py         :   one.cityname_py,
	        countryname         :   one.countryname,
	        // // countrycode         :   one.countrycode,
	        recommand_day       :   one.recommand_day,
	        recommand_indensity :   one.recommand_indensity,
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
		}
	},{safe: true}, callback)

}