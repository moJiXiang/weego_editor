var routes = require('./routes/routes')
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	models = require('./models');

module.exports = function(app) {
	app.post('/addlabel', routes.label.saveLabel);

	app.post('/label', routes.label.addLabel);
	app.get('/label/:labelID', routes.label.getLabel);
	app.del('/label/:labelID', routes.label.deleteLabel);
	app.put('/label/:labelID', routes.label.updateLabel);
	app.get('/getAllLabel', routes.label.getAllLabel);
	app.get('/getLabelByPage/:pageLimit/:pageIndex', routes.label.getLabelByPage);
	app.get('/getLabelByLevel/:num',routes.label.getLabelByLevel);
	app.get('/getLabelByLabelID/:labelID',routes.label.getLabelByLabelID);
	app.get('/getLabelByLabId/:id', routes.label.getLabelByLabId);
	app.get('/getLabelByID/:id',routes.label.getLabelByID);
	app.get('/attractionsimage/:imageId', routes.attractions.getAttractionsImage);
	app.get('/delUploadImage/:_id/:imageName', routes.attractions.delUploadImage);
	app.get('/setCoverImg/:_id/:imageName', routes.attractions.setCoverImg);
	app.post('/postimage', routes.attractions.postimage);
	//attractions
	app.post('/attractions', routes.attractions.saveAttractions);
	app.get('/attractions/:attractionsID', routes.attractions.getAttractions);
	app.del('/attractions/:attractionsID', routes.attractions.deleteAttractions);
	app.put('/attractions/:attractionsID', routes.attractions.updateAttractions);

	app.get('/getAttractionsImage/:attractionsID', routes.attractions.getAttractionsImage);


	app.get('/getAllAttractions', routes.attractions.getAllAttractions);
	app.get('/getAttractionsByPage/:pageLimit/:pageIndex?', routes.attractions.getAllAttractionsByPage);

	app.get('/getAllUserCreateAttractionsByPage/:pageLimit/:pageIndex/:name?', routes.attractions.getAllUserCreateAttractionsByPage);
	app.get('/checkattractions/:attractionsID', routes.attractions.getAttractions);
	app.put('/checkattractions/:attractionsID',routes.attractions.checkattractions);
	app.post('/upload',routes.attractions.upload);

	app.post('/addMasterLabelToAttractions',routes.attractions.addMasterLabelToAttractions);
	app.post('/addSubLabelToAttractions',routes.attractions.addSubLabelToAttractions);
	app.get('/getAttractionsByLabelID/:labelID/:cityName',routes.attractions.getAttractionsByLabelID);



	//city
	app.post('/city', routes.city.saveCity);
	app.get('/city/:cityID', routes.city.getCity);
	app.del('/city/:cityID', routes.city.deleteCity);
	app.put('/city/:cityID', routes.city.updateCity);
	app.post('/updatecity', routes.city.updateCityNew);
	app.post('/updatecityitem', routes.city.updateResShopItem);
	app.post('/updateattritem', routes.city.updateAttrItem);
	app.post('/updateareaitem', routes.city.updateAreaItem);
	app.get('/getAllCity', routes.city.getAllCity);
	app.get('/getCountryCities/:countryname', routes.city.getCountryCities);
	app.get('/getCountryCities/:countryname/:cityid', routes.city.getCityByName);
	app.get('/getCountryCities/:countryname/:cityname/:type', routes.city.getCityItem);
	app.get('/getCountryCities/:countryname/:cityname/:type/:itemname', routes.city.showCityItem);
	// app.get('/getCountryCities/:countryname?', routes.city.getOneCityByName);
	app.get('/getAllCountries', routes.country.getAllCountries);
	app.get('/getAllCityBaseInfo', routes.city.getAllCityBaseInfo);
	app.get('/getCityByPage/:pageLimit/:pageIndex?', routes.city.getCityByPage);
	app.get('/getCityByLabelID/:labelID', routes.city.getCityByLabelID);
	app.get('/getCountriesByContinent/:continentCode',routes.city.getCountriesByContinent);
	app.get('/getCityByCountry/:countryCode',routes.city.getCityByCountry);
	app.get('/getCountryStatistic/:countryCode',routes.city.getCountryStatistic);

	app.get('/setCityCoverImg/:_id/:imageName', routes.city.setCityCoverImg);
	app.post('/citypic/upload',routes.city.upload);
	app.get('/delCoverImage/:_id/:imageName',routes.city.delCoverImage);

	app.post('/citypic/upload_background_img',routes.city.upload_background_img);
	app.get('/delBackgroundImage/:_id/:imageName',routes.city.delBackgroundImage);
	app.get('/cityCoverimage/:imageId', routes.city.getCityCoverImage);
	app.get('/cityBackimage/:imageId', routes.city.getCitBackImage);

	// app.post('/login',routes.editUser.login);

	app.post('/user',routes.editUser.saveUser);
	app.put('/user/:userID',routes.editUser.updateUser);
	app.del('/user/:userID', routes.editUser.deleteUser);
	app.get('/getUserByPage/:pageLimit/:pageIndex', routes.editUser.getUserByPage);
	app.get('/getAllEditor', routes.editUser.getAllEditor);



	app.post('/addMasterLabelToCities',routes.city.addMasterLabelToCities);
	app.post('/addSubLabelToCities',routes.city.addSubLabelToCities);

	//hotel
	app.get('/hotel/:hotelId', routes.hotel.get);
	app.del('/hotel/:hotelId', routes.hotel.remove);
	app.put('/hotel/:hotelId', routes.hotel.update);
	app.post('/hotel', routes.hotel.addNewHotel);
	app.get('/hotel/image/:fileName', routes.hotel.getImage);
	app.post('/hotel/image/:hotelId', routes.hotel.uploadImage);
	app.get('/hotels/:pageLimit/:pageIndex?', routes.hotel.getHotelByPage);
	app.get('/delUploadImageHotel/:_id/:imageName',routes.hotel.delUploadImageHotel);

	//category
	app.get('/category/:categoryId', routes.life.getCategory);
	app.del('/category/:categoryId', routes.life.removeCategory);
	app.put('/category/:categoryId', routes.life.updateCategory);
	app.post('/category', routes.life.addNewCategory);
	app.post('/addcityitem', routes.life.addNewRestaurant);

	app.get('/categorys/:pageLimit/:pageIndex/:type', routes.life.getCategoryByPage);
	app.get('/categorys/:pageLimit/:pageIndex', routes.life.getCategoryByPage);
	app.get('/getCategorysByQuery/:type/:name?',routes.life.getCategorysByQuery);

	//lifetag
	app.get('/lifetag/:lifetagId', routes.life.getLifetag);
	app.del('/lifetag/:lifetagId', routes.life.removeLifetag);
	app.put('/lifetag/:lifetagId', routes.life.updateLifetag);
	app.post('/lifetag', routes.life.addNewLifetag);
	// app.get('/setResShopCoverImg', routes.life.setResShopCoverImg);
	app.get('/lifetags/:pageLimit/:pageIndex/:type', routes.life.getLifetagByPage);
	app.get('/lifetags/:pageLimit/:pageIndex', routes.life.getLifetagByPage);
	app.get('/getLifetagsByType/:type',routes.life.getLifetagsByType);

	//area
	app.get('/area/:areaId', routes.life.getArea);
	app.del('/area/:areaId', routes.life.removeArea);
	app.put('/area/:areaId', routes.life.updateArea);
	app.post('/area', routes.life.addNewArea);
	app.post('/area/upload', routes.life.uploadAreaImg);
	app.get('/setAreaCoverImg/:id/:imageName', routes.life.setAreaCoverImg);
	app.get('/delareaimg/:id/:imageName', routes.life.delAreaImg);

	app.get('/areas/:pageLimit/:pageIndex', routes.life.getAreaByPage);
	app.get('/getAreasByCityId/:cityId',routes.life.getAreasByCityId);
	app.get('/getAreasByCityName/',routes.life.getAreasByCityName);

	//restaurant
	app.get('/restaurant/:restaurantId', routes.life.getRestaurant);
	app.del('/restaurant/:restaurantId', routes.life.removeRestaurant);
	app.put('/restaurant/:restaurantId', routes.life.updateRestaurant);
	app.post('/restaurant', routes.life.addNewRestaurant);
	app.get('/restaurants/:pageLimit/:pageIndex?', routes.life.getRestaurantByPage);
	// app.get('/restaurants/:pageLimit/:pageIndex/:city_name/:lifename',routes.life.getRestaurantByPage);
	app.get('/restaurants/:pageLimit/:pageIndex/:city_name/:areaname/:lifename/:tags', routes.life.getRestaurantByPage);

	//shopping
	app.get('/shopping/:shoppingId', routes.life.getShopping);
	app.del('/shopping/:shoppingId', routes.life.removeShopping);
	app.put('/shopping/:shoppingId', routes.life.updateShopping);
	app.post('/shopping', routes.life.addNewShopping);
	app.get('/shoppings/:pageLimit/:pageIndex?', routes.life.getShoppingByPage);
	app.get('/getBigShoppingByCityId/:cityId', routes.life.getBigShoppingByCityId);
	app.post('/shoppings/:areaname', routes.life.getShoppingByPage);

	//entertainment
	app.get('/entertainment/:entertainmentId', routes.life.getEntertainment);
	app.del('/entertainment/:entertainmentId', routes.life.removeEntertainment);
	app.put('/entertainment/:entertainmentId', routes.life.updateEntertainment);
	app.post('/entertainment', routes.life.addNewEntertainment);
	app.get('/entertainments/:pageLimit/:pageIndex?', routes.life.getEntertainmentByPage);

	app.post('/postLifeImage', routes.life.postLifeImage);
	// app.post('/postLifeImage/:_id/:type', routes.life.postLifeImage);
	app.get('/delUploadImageLife/:_id/:imageName/:_type', routes.life.delUploadImageLife);
	app.get('/setCoverImgLife/:_id/:imageName/:_type', routes.life.setCoverImgLife);

	//task
	app.get('/task/:taskId', routes.task.getTask);
	app.del('/task/:taskId', routes.task.removeTask);
	app.put('/task/:taskId', routes.task.updateTask);
	app.post('/task', routes.task.addNewTask);
	app.get('/tasks/:pageLimit/:pageIndex?', routes.task.getTaskByPage);
	app.get('/getMyToDoTasks', routes.task.getMyToDoTasks);
	app.get('/statistic/:taskId',routes.task.statistic);
	app.get('/getAllTasks/:pageLimit/:pageIndex?', routes.task.getAllTasksByPage);

	//auditing
	app.get('/auditing/:auditingId', routes.task.getAuditing);
	app.del('/auditing/:auditingId', routes.task.removeAuditing);
	app.put('/auditing/:auditingId', routes.task.updateAuditing);
	app.post('/auditing', routes.task.addNewAuditing);
	app.get('/auditings/:pageLimit/:pageIndex?', routes.task.getAuditingByPage);
	app.get('/askApproval/:auditingId',routes.task.askApproval);
	app.get('/getApprovalAuditings/:taskId',routes.task.getApprovalAuditings);
	app.post('/approvalAuditings',routes.task.approvalAuditings);

	app.post('/savetoauditing',routes.auditing.addAuditTask);
	app.post('/passthiscity/',routes.auditing.updateAuditTask);
	app.post('/passthiscityitem/',routes.auditing.updatecityitemAuditTask);
	app.get('/getedithistory', routes.auditing.getedithistory);
	app.get('/getaudithistory', routes.auditing.getaudithistory);
	//taskquestion
	app.get('/taskquestion/:taskquestionId', routes.task.getTaskquestion);
	app.del('/taskquestion/:taskquestionId', routes.task.removeTaskquestion);
	app.put('/taskquestion/:taskquestionId', routes.task.updateTaskquestion);
	app.post('/taskquestion', routes.task.addNewTaskquestion);
	app.get('/taskquestions/:pageLimit/:pageIndex?', routes.task.getTaskquestionByPage);
	app.get('/closeTaskquestion/:taskquestionId', routes.task.closeTaskquestion);

	app.get('/dataImport?',routes.dataImport.importCity);
	app.get('/importLifeData?',routes.lifeImport.importLifeData);
	app.get('/getTopCategoryByCity/:cityname',routes.lifeImport.getTopCategoryByCity);
	app.get('/getMichilin',routes.lifeImport.getMichilin);
	// app.get('/importCategoryRestaurantData?',routes.lifeImport.importCategoryRestaurantData);
	// app.get('/importCategoryShoppingData?',routes.lifeImport.importCategoryShoppingData);
	// app.get('/saveRestaurantCategory?',routes.lifeImport.saveRestaurantCategory);

	app.get('/saveSpotToText?',routes.pathImport.saveSpotToText);
	app.get('/importPathToDB?',routes.pathImport.importPathToDB);
	app.get('/importPathToDBSync',routes.pathImport.importPathToDBSync);
	app.get('/runFillTaskQueen',routes.pathImport.runFillTaskQueen);
	app.get('/autoreload',routes.pathImport.autoReloadPage);

	app.get('/showeditors', routes.editUser.showEditors);
	app.get('/geteditors', routes.editUser.getEditors);

	passport.use(new LocalStrategy(function(username, password, done) {
		models.User.findOne({username: username}, function (err, user) {
			if (err) return done(err);
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.checkPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}));

	var loadUser = function (req, res, next) {
		//load user object to req.
		if (!req.session.user) {
			//not yet login, redirect to login page
			return res.send(401, {status: 401, type: 'Unauthorized', message: 'authentication required'});
		}

		req.user = req.session.user;
		next();
	};

	var authorize = function(req, res, next) {
		var parts = req.path.split('/'); //['rest', ':entities', ':id']
		var resource = {
			type : 'rest',
			value : req.method + ' /rest/' + parts[2]
		}
		req.user.hasPermission(resource, function (err, perm) {
			if (!perm) {
				res.send(401, {
	                status: 401,
	                type : 'Unauthorized',
	                message : 'You are not authorized to access ' + resource
	            });
	            return;
			}
		});
		next();
	};

	var guessModel = function () {
		var map = {};
		for (var i in models) {
			map[i] = models[i];
			map[i+'s'] = models[i];
			map[i.toLowerCase()] = models[i];
			map[i.toLowerCase() + 's'] = models[i];
		}
		//special case
		map['cities'] = models.City;
		map['categories'] = models.Category;

	    return function (req, res, next) {
	    	var parts = req.path.split('/'); //['rest', ':entities', ':id']
	    	if (parts.length < 3 || !map[parts[2]]) {
	    		res.send(400, {
		            status: 400,
		            type : 'Bad Request',
		            message: 'entity name is invalid : ' + parts[2]
		        });
		        return;
	    	}
	    	req.model = map[parts[2]];
	    	next();
	    };
	};

	app.get('/login', function (req, res) {
		if (req.session.user) {
			return res.send({message: "You have already login, " + req.session.user.username});
		}
		res.send({message: 'You need use ajax post to this url to do authentication'});
	});

	// app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
	app.post('/login', passport.authenticate('local', {assignProperty: 'user'}), function (req, res) {
		//process req.user
		req.session.user = req.user;
		res.send(200, {m: 'succes -- TBD'});
	});

	// app.all('/rest/*', loadUser, authorize, guessModel());
	app.all('/rest/*', guessModel());

	app.get(  '/rest/:entities',     routes.rest.getEntities  );
	app.post( '/rest/:entities',     routes.rest.postEntities );
	app.del(  '/rest/:entities',     routes.rest.delEntities  );
	app.put(  '/rest/:entities',     routes.rest.putEntities  );

	app.get(  '/rest/:entities/:id', routes.rest.getEntity  );
	app.post( '/rest/:entities/:id', routes.rest.postEntity );
	app.del(  '/rest/:entities/:id', routes.rest.delEntity  );
	app.put(  '/rest/:entities/:id', routes.rest.putEntity  );
	
};

// routes.lifeImport.initCategoryData();