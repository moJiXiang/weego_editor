var routes = require('./routes/routes');

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
	app.get('/getAllCity', routes.city.getAllCity);
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

	app.post('/login',routes.editUser.login);

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
	app.get('/categorys/:pageLimit/:pageIndex/:type', routes.life.getCategoryByPage);
	app.get('/categorys/:pageLimit/:pageIndex', routes.life.getCategoryByPage);
	app.get('/getCategorysByQuery/:type/:name?',routes.life.getCategorysByQuery);

	//lifetag
	app.get('/lifetag/:lifetagId', routes.life.getLifetag);
	app.del('/lifetag/:lifetagId', routes.life.removeLifetag);
	app.put('/lifetag/:lifetagId', routes.life.updateLifetag);
	app.post('/lifetag', routes.life.addNewLifetag);
	app.get('/lifetags/:pageLimit/:pageIndex/:type', routes.life.getLifetagByPage);
	app.get('/lifetags/:pageLimit/:pageIndex', routes.life.getLifetagByPage);
	app.get('/getLifetagsByType/:type',routes.life.getLifetagsByType);

	//area
	app.get('/area/:areaId', routes.life.getArea);
	app.del('/area/:areaId', routes.life.removeArea);
	app.put('/area/:areaId', routes.life.updateArea);
	app.post('/area', routes.life.addNewArea);
	app.get('/areas/:pageLimit/:pageIndex', routes.life.getAreaByPage);
	app.get('/getAreasByCityId/:cityId',routes.life.getAreasByCityId);

	//restaurant
	app.get('/restaurant/:restaurantId', routes.life.getRestaurant);
	app.del('/restaurant/:restaurantId', routes.life.removeRestaurant);
	app.put('/restaurant/:restaurantId', routes.life.updateRestaurant);
	app.post('/restaurant', routes.life.addNewRestaurant);
	app.get('/restaurants/:pageLimit/:pageIndex?', routes.life.getRestaurantByPage);


	//shopping
	app.get('/shopping/:shoppingId', routes.life.getShopping);
	app.del('/shopping/:shoppingId', routes.life.removeShopping);
	app.put('/shopping/:shoppingId', routes.life.updateShopping);
	app.post('/shopping', routes.life.addNewShopping);
	app.get('/shoppings/:pageLimit/:pageIndex?', routes.life.getShoppingByPage);
	app.get('/getBigShoppingByCityId/:cityId', routes.life.getBigShoppingByCityId);

	//entertainment
	app.get('/entertainment/:entertainmentId', routes.life.getEntertainment);
	app.del('/entertainment/:entertainmentId', routes.life.removeEntertainment);
	app.put('/entertainment/:entertainmentId', routes.life.updateEntertainment);
	app.post('/entertainment', routes.life.addNewEntertainment);
	app.get('/entertainments/:pageLimit/:pageIndex?', routes.life.getEntertainmentByPage);

	app.post('/postLifeImage', routes.life.postLifeImage);
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
	
};

routes.lifeImport.initCategoryData();