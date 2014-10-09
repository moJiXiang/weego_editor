var async  = require('async'),
    config = require('../config/Config'),
	request = require('request'),
	fs = require('fs');
var models = require('../models');

var ids = ['516a34f958e3511036000001','516a34f958e3511036000002','516a34f958e3511036000003'];
// models.Attractions.find({'city_id':{$in:ids}}, function())