var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //购物
var ShoppingSchema = new Schema({
  name: { type: String },
  city_name: { type: String },
  city_id: { type: ObjectId ,index: true },
  latitude: { type: String },
  longitude: { type: String },
  address: { type: String },
  postal_code: { type: String },
  introduce: { type: String },
  tel: { type: String },
  category: { type: Array },
  lifetag: { type: Array },
  open_time: { type: Array },
  image: { type: Array },
  cover_image: { type: String },
  show_flag: {type:Boolean,default:false},
  create_at: { type: Date, default: Date.now },

  rating: { type: Number ,default: 3},
  rating_service: { type: Number ,default: 3},
  rating_env: { type: Number ,default: 3},
  rating_trust: { type: Number ,default: 3},
  score: { type: Number ,default: 60},
  reviews: { type: Number ,default: 0},

  price_level: { type: Number },
  price_desc: { type: String },
  url: { type: String }
});

mongoose.model('Shopping', ShoppingSchema);
