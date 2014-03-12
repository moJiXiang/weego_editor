/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var CityProvider = require("../config/CityProvider").CityProvider;
var cityProvider = new CityProvider();
var ObjectID = require('mongodb').ObjectID;
var LabelProvider = require("../config/LabelProvider").LabelProvider;
var labelProvider = new LabelProvider();
fs = require('fs');
var im = require('imagemagick');
im.identify.path = global.imIdentifyPath;
im.convert.path = global.imConvertPath;
var upyunClient = require('./upyun/upyunClient');
var Country =  require('./country');

exports.getAllCity = function (req, res) {

    cityProvider.find({}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};

exports.getCityByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    cityProvider.count({}, function (err, count) {
        cityProvider.find({}, {sort:{'show_flag':-1,'hot_flag':-1}, skip:skip, limit:req.params.pageLimit}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({city:result, count:count});
            }
        });
    });

};

function getSubLabel(label, sblabel, callback) {
    var _id = label;
    labelProvider.findOne({'_id':new ObjectID(_id)}, {'label':1}, function (err, re) {
        if (err) {
        } else {
            if (re) {
                sblabel.push({'label':re.label, '_id':re._id});
                callback(sblabel);
            } else {
                callback(sblabel);
            }
        }

    });
}
function startTask(paramsArray, sblabel, current, count, callBack) {
    if (current >= count) {
        callBack(sblabel);
    } else {
        getSubLabel(paramsArray[current], sblabel, function (sblabel) {
            startTask(paramsArray, sblabel, current + 1, count, callBack);
        });
    }
}
exports.getCity = function (req, res) {
    if (req.params.cityID) {
        cityProvider.findOne({_id:new ObjectID(req.params.cityID)}, {}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                if (result.masterLabel) {
                    labelProvider.findOne({_id:new ObjectID(result.masterLabel)}, {}, function (err, data) {
                        if (err) {
                            res.end();
                        } else {
                            if (data) {
                                result.masterLabel = {'masterLabel':data.label, '_id':data._id};
                                var sblabel = [];
                                if (result.subLabel && result.subLabel.length) {
                                    startTask(result.subLabel, sblabel, 0, result.subLabel.length, function (sblabel) {
                                        result.subLabel = sblabel;
                                        res.send(result);
                                    });
                                } else {
                                    res.send(result);
                                }
                            } else {
                                res.send(result);
                            }
                        }
                    });
                } else {
                    var sblabel = [];
                    result.masterLabel = {'masterLabel':'', '_id':''};
                    if (result.subLabel && result.subLabel.length) {
                        startTask(result.subLabel, sblabel, 0, result.subLabel.length, function (sblabel) {
                            result.subLabel = sblabel;
                            res.send(result);
                        });
                    } else {
                        res.send(result);
                    }
                }
            }
        });
    }
};

exports.saveCity = function (req, res) {
    var data = req.body;
    if (data.label && data.label.length > 0) {
        var sub = [];
        for (var i = 0; i < data.label.length; i++) {
            sub.push(data.label[i]);
        }
    }

    data.subLabel = sub;
    data.random = Math.random();
    cityProvider.insert(data, {safe:true}, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result[0]._id});
        }
    });
};
exports.updateCity = function (req, res) {
    var data = req.body;
    if (data.label.length > 0) {
        var sub = [];
        for (var i = 0; i < data.label.length; i++) {
            console.log(data.label[i]);
            sub.push(data.label[i]);
        }
    }
    data.subLabel = sub;
    var setJson = {
        continents:data.continents,
        continentscode:data.continentscode,
        cityname:data.cityname,
        cityname_en:data.cityname_en,
        cityname_py:data.cityname_py,
        countryname:data.countryname,
        countrycode:data.countrycode,
        recommand_day:data.recommand_day,
        recommand_indensity:data.recommand_indensity,
        recommand_center:data.recommand_center,
        introduce:data.introduce,
        short_introduce:data.short_introduce,
        tips:data.tips,
        traffic:data.traffic,
        hot_flag:data.hot_flag,
        show_flag:data.show_flag,
        masterLabel:data.masterLabel,
        subLabel:data.subLabel,
        latitude:data.latitude,
        longitude:data.longitude,
        weoid:data.weoid
    };
    cityProvider.update({_id:new ObjectID(req.params.cityID)}, {$set:setJson}, {safe:true}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

exports.deleteCity = function (req, res) {
    cityProvider.remove({_id:new ObjectID(req.params.cityID)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({_id:req.params.attractionsID});
        }
    });
};
function copyCoverImage(globalpath, strpath, despath, callback) {
    var fileReadStream = fs.createReadStream(globalpath + strpath);
    var fileWriteStream = fs.createWriteStream(globalpath + despath);
    fileReadStream.pipe(fileWriteStream);
    fileWriteStream.on('close', function () {
        callback();
    });
}
exports.setCityCoverImg = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    cityProvider.update({_id:new ObjectID(_id)}, {$set:{'coverImageName':imageName, "imgFlag":true}}, {safe:true}, function (err) {
        if (err) {
            throw err;
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json(imageName);
            res.end();
        }
    });
    // cityProvider.findOne({_id:new ObjectID(_id), 'coverImageName':{$exists:true}}, {}, function (err, result) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         if (result) {
    //             copyCoverImage(global.imgpathCO, imageName, result.coverImageName, function () {
    //                     copyCoverImage(global.imgpathC2, imageName, result.coverImageName, function () {
    //                         copyCoverImage(global.imgpathC3, imageName, result.coverImageName, function () {
    //                             res.setHeader("Content-Type", "application/json");
    //                             res.json(result.coverImageId);
    //                             res.end();
    //                         });
    //                     });
    //             });
    //         } else {
    //             var suffix = imageName.split(".")[1];
    //             var cover_id = new ObjectID();
    //             var cover_name = cover_id + '.' + suffix;
    //             copyCoverImage(global.imgpathCO, imageName, cover_name, function () {
    //                     copyCoverImage(global.imgpathC2, imageName, cover_name, function () {
    //                         copyCoverImage(global.imgpathC3, imageName, cover_name, function () {
    //                             cityProvider.update({_id:new ObjectID(_id)}, {$set:{'coverImageName':cover_name, "imgFlag":true}}, {safe:true}, function (err) {
    //                                 if (err) {
    //                                     throw err;
    //                                 } else {
    //                                     res.setHeader("Content-Type", "application/json");
    //                                     res.json(cover_name);
    //                                     res.end();
    //                                 }
    //                             });
    //                         });
    //                     });
    //                 });
    //         }
    //     }
    // });
};
//上传封面图片
exports.upload = function (req, res) {
    var target_upload_name;
    if (req.files.upload && req.body._id) {
        var id = new ObjectID();
        var tmp_upload = req.files.upload;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathCO + target_upload_name;
        var filePathC2 = global.imgpathC2 + target_upload_name;
        var filePathC3 = global.imgpathC3 + target_upload_name;
        changeImageSize(req, tmp_upload_path, target_upload_path, filePathC2, filePathC3, function () {
            upyunClient.upCityToYun(target_upload_name,function(err,data){
                if(err) throw err;
                cityProvider.update({_id:new ObjectID(req.body._id)}, {$push:{ 'image':target_upload_name}}, {safe:true}, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
};
function changeImageSize(req, tmp_path, target_path,target_path_middle, target_path_small, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        fs.unlink(tmp_path, function () {
                im.crop({srcPath:target_path,dstPath:target_path_middle,width:global.imgsizeC2.width,height:global.imgsizeC2.height,quality:1,gravity:'Center'}, function (err, metadata) {
                    if (err) throw err;
                    im.crop({srcPath:target_path,dstPath:target_path_small,width:global.imgsizeC3.width,height:global.imgsizeC3.height,quality:1,gravity:'Center'}, function (err, metadata) {
                        if (err) throw err;
                        process.nextTick(callback);
                    });
                });
        });
    });
};
exports.delCoverImage = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathCO + imageName, function () {
        fs.unlink(global.imgpathC2 + imageName, function () {
            fs.unlink(global.imgpathC3 + imageName, function () {
                cityProvider.update({_id:new ObjectID(_id)}, {$pull:{ 'image':imageName}}, {safe:true}, function (err) {
                    if (err) throw err;
                    upyunClient.delCityFromYun(imageName,function(err,data){
                        if(err) res.send({'status':'fail'});
                        res.send({'status':'success'});
                    });
                });
            });
        });
    });
};

//上传前台页面城市背景大图
exports.upload_background_img = function (req, res) {
    var target_upload_name;
    if (req.files.upload && req.body._id) {
        var tmp_upload = req.files.upload;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathC1 + target_upload_name;
        makeImageFile(tmp_upload_path, target_upload_path, function () {
            upyunClient.upCityBgToYun(target_upload_name,function(err,data){
                cityProvider.update({_id:new ObjectID(req.body._id)}, {$push:{ 'backgroundimage':target_upload_name}}, {safe:true}, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
};
//删除背景图片
exports.delBackgroundImage = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathC1 + imageName, function () {
        cityProvider.update({_id:new ObjectID(_id)}, {$pull:{ 'backgroundimage':imageName}}, {safe:true}, function (err) {
            if (err) throw err;
            upyunClient.delCityBgFromYun(imageName,function(err,data){
                res.send({'status':'success'});
            });
        });
    });
};
function makeImageFile(tmp_path, target_path, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        callback();
    });
};
function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return  _id + '.' + suffix;
}
// 上传前台页面左边大图 废弃
exports.upload_left_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_left_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}, $set:{"img_left_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};

// 上传前台页面小图 废弃
exports.upload_small_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_small_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_small':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}, $set:{"img_small_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_small':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};

// 上传前台页面右边中图 废弃
exports.upload_right_middle_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_right_middle_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_right_middle':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}, $set:{"img_right_middle_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_right_middle':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};
// 上传前台页面左边中图
exports.upload_left_middle_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_left_middle_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left_middle':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}, $set:{"img_left_middle_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left_middle':{'imageID':imageID, 'imageExtention':fileExtention, 'imagename':imageID + '.' + fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};

exports.getCityByLabelID = function (req, res) {
    cityProvider.find({masterLabel:req.params.labelID}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};


exports.addMasterLabelToCities = function(req,res){
    var data =  req.body;
    var labelId = data.labelId+'';
    var cityList = data.cityList;
    stringToObject(cityList,function(new_id){
        cityProvider.update({_id:{ $in: new_id } },{$set:{masterLabel:labelId}},{safe:true,multi:true},function(err){
            if(err) throw err;
            res.send('issuccess',true);
        });
    });
};
 function stringToObject(strings,callback){
     var new_id = [];
     for(var i=0;i<strings.length;i++){
         new_id.push(new ObjectID(strings[i]));
         if(i==strings.length-1){
             callback(new_id)
         }
     }
 }
exports.addSubLabelToCities = function(req,res){
    var data =  req.body;
    var labelIds = data.labelIds;
    var cityList = data.cityList;
    stringToObject(cityList,function(new_id){
        cityProvider.update({_id:{ $in: new_id } },{$set:{subLabel:labelIds}},{safe:true,multi:true},function(err){
            if(err) throw err;
            res.send('issuccess',true);
        });
    });
}
exports.getCitBackImage = function (req, res) {
    var imageID = req.params.imageId;
    if (imageID != 'undefined') {
        var path = global.imgpathC1 + req.params.imageId;
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
};

exports.getCityCoverImage = function (req, res) {
    var imageID = req.params.imageId;
    if (imageID != 'undefined') {
        var path = global.imgpathCO + req.params.imageId;
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
};

exports.getCountriesByContinent = function(req,res){
    var continentCode = req.params.continentCode;
    if(continentCode){
        Country.getCountriesByContinent(continentCode ,function(err,countries){
            if(err)
                res.send({'status':false});
            else
                res.send({'status':true,'countries':countries});
        });
    }else{
        res.send({'status':false});
    }
};

exports.getCityByCountry = function(req,res){
    var countryCode = req.params.countryCode;
    if(countryCode){
        cityProvider.find({countrycode:countryCode},{sort:{cityname:1}},function(err,cities){
            if(err)
                res.send({'status':false});
            else
                res.send({'status':true,'cities':cities});
        });
    }else{
        res.send({'status':false});
    }
};








