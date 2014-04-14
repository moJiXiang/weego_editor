var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //餐馆
var RestaurantSchema = new Schema({
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
  recommand_flag :{ type: Boolean, default:false },
  index_flag :{ type: Boolean, default:false },
  local_flag :{ type: Boolean, default:false },
  ranking: { type: Number },
  area_id: {type: ObjectId},
  area_name: {type: String},
  michilin_flag:{ type: Boolean ,default: false},

  rating: { type: Number ,default: 3},
  rating_service: { type: Number ,default: 3},
  rating_env: { type: Number ,default: 3},
  rating_food: { type: Number ,default: 3},
  score: { type: Number ,default: 60},
  reviews: { type: Number ,default: 0},
  comments: { type: Array },

  price_level: { type: Number ,default: 3},
  price_desc: { type: String ,default: '一般'},
  website: { type: String },
  url: { type: String },
  info:{
    wifi: { type: Boolean ,default: false},
    yu_ding : {type:Boolean,default:false},
    delivery : {type:Boolean,default:false},
    take_out : {type:Boolean,default:false},
    card : {type:Boolean,default:false},
    g_for :  { type: String },
    g_f_kid : {type:Boolean,default:false},
    g_f_group : {type:Boolean,default:false},
    noise : { type: String },
    alcohol : { type: String },
    out_seat : {type:Boolean,default:false},
    tv : {type:Boolean,default:false},
    waiter : {type:Boolean,default:false}
  }
});

mongoose.model('Restaurant', RestaurantSchema);
