var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //大类
 //餐馆 非洲菜，美洲菜等。
 //购物 种类，衣服，男装，女装，裤子，奢侈品，化妆品，等等。
 //游玩 种类，游泳池、SPA水疗馆、歌舞厅、KTV、桌球房、保龄球馆、棋牌室、网球场
 //type 1:餐馆，2：购物，3：游玩。
var AreaSchema = new Schema({
	city_id: { type: ObjectId ,index: true },
	city_name: { type: String },
	area_name: { type: String },
	area_enname: { type: String },
	introduce: {type: String},
	address: {type: String},
	latitude: { type: String },
  	longitude: { type: String },
  	cover_image: {type : String}
});

mongoose.model('Area', AreaSchema);
