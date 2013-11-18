
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/routes.js')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//label
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
app.get('/getAttractionsByPage/:pageLimit/:pageIndex/:name?', routes.attractions.getAllAttractionsByPage);

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
app.get('/getCityByPage/:pageLimit/:pageIndex', routes.city.getCityByPage);
app.get('/getCityByLabelID/:labelID', routes.city.getCityByLabelID);

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

app.post('/addMasterLabelToCities',routes.city.addMasterLabelToCities);
app.post('/addSubLabelToCities',routes.city.addSubLabelToCities);

//hotel
app.get('/hotel/:hotelId', routes.hotel.get);
app.del('/hotel/:hotelId', routes.hotel.remove);
app.put('/hotel/:hotelId', routes.hotel.update);
app.post('/hotel', routes.hotel.addNewHotel);
app.get('/hotel/image/:fileName', routes.hotel.getImage);
app.post('/hotel/image/:hotelId', routes.hotel.uploadImage);
app.get('/hotels/:pageLimit/:pageIndex', routes.hotel.getHotelByPage);

app.get('/upyun', routes.upyun.UPYun);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
