/**
 * User: katat
 * Date: 9/8/13
 * Time: 10:17 AM
 */
require('../config/Config');
var fs = require('fs');
var HotelProvider = require('../config/HotelProvider').HotelProvider;
var ObjectID = require('mongodb').ObjectID;
var hotelProvider = new HotelProvider();

exports.addNewHotel = function(req, res){
    var hotelDetails = req.body;
    hotelProvider.insert(hotelDetails, {safe:true}, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result[0]._id});
        }
    });
}

exports.update = function(req, res){
    var json = req.body;
    delete json._id;
    hotelProvider.update({_id:new ObjectID(req.params.hotelId)}, {$set:json}, {safe:true}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
}

exports.get = function(req, res){

    hotelProvider.findOne({_id:new ObjectID(req.params.hotelId)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
}

exports.getHotelByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    hotelProvider.count({}, function (err, count) {
        hotelProvider.find({}, {sort:{_id:1} , skip:skip, limit:req.params.pageLimit}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({hotels:result, count:count});
            }
        });
    });
};

exports.remove = function(req, res){
    console.log(new ObjectID(req.params.hotelId));
    hotelProvider.remove({_id:new ObjectID(req.params.hotelId)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({_id:req.params.hotelId});
        }
    });
}

exports.getImage = function(req, res){
    var imageID = req.params.fileName;
    if (imageID != 'undefined') {
        var path = global.imgpathD0 + imageID;
        fs.exists(path, function (exists) {
            if (exists) {
                fs.readFile(path, "binary", function (err, data) {
                    if (err) {
                        res.end();
                        throw err;
                    } else {
                        if (data) {
                            res.write(data, "binary");
                            res.end();
                        } else {
                            res.end();
                        }
                    }
                });
            } else {
                res.end();
            }
        });
    } else {
        res.end();
    }
}

exports.uploadImage = function(req, res){
    var target_upload_name;
    if (req.files.length != 0 && req.body._id) {
        var tmp_upload = req.files.files[0];
        console.log(req.files.files[0]);
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathD0 + target_upload_name;
        console.log(target_upload_path);
        makeImageFile(tmp_upload_path, target_upload_path, function () {
            hotelProvider.update({_id:new ObjectID(req.body._id)}, {$push:{ 'images':target_upload_name}}, {safe:true}, function (err) {
                if (err) {
                    throw err;
                } else {
                    res.setHeader("Content-Type", "application/json");
                    var hotelModel = hotelProvider.findOne({_id:new ObjectID(req.body._id)}, {}, function(err, result){
                        res.json(result.images);
                        res.end();
                    });

                }
            });
        });
    } else {
        res.end();
    }
}

function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return  _id + '.' + suffix;
}

function makeImageFile(tmp_path, target_path, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        callback();
    });
};