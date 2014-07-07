/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var AttractionsProvider = require("../config/AttractionsProvider").AttractionsProvider;
var attractionsProvider = new AttractionsProvider();
var BinaryProvider = require("../config/BinaryProvider.js").BinaryProvider;
var binaryProvider = new BinaryProvider();
var LabelProvider = require("../config/LabelProvider").LabelProvider;
var labelProvider = new LabelProvider();
var ObjectID = require('mongodb').ObjectID;
fs = require('fs');
var im = require('imagemagick');
im.identify.path = global.imIdentifyPath;
im.convert.path = global.imConvertPath;
var upyunClient = require('./upyun/upyunClient');
var Util = require('./util');

exports.saveAttractions = function (req, res) {
    var data = req.body;
    if (data.subLabel.length > 0) {
        var sub = [];
        for (var i = 0; i < data.subLabel.length; i++) {
            sub.push(data.subLabel[i]);
        }
    }
    data.subLabel = sub;
    data.createFlag = '0';
    data.checkFlag = '1';
    data.createPreson = 'weego';
    data.random = Math.random();

    attractionsProvider.insert(data, {safe:true}, function (err, result) {
        if (err) {
            console.log("AttractionsProvider.insert err: ", err);
            res.send({isSuccess:false, info:err});
        } else {
            console.log("userProvider.insert result: ", result);
            res.send({isSuccess:true, _id:result[0]._id,user_id:req.session.user._id});
        }
    });
};
exports.getAllAttractions = function (req, res) {

    attractionsProvider.find({}, {}, function (err, result) {
        if (err) {
            console.log("AttractionsProvider.find err: ", err);
            res.send({err:err});
        } else {
            console.log("AttractionsProvider.find result: ", result);
            res.send(result);
        }
    });
};
exports.deleteAttractions = function (req, res) {
    attractionsProvider.remove({_id:new ObjectID(req.params.attractionsID)}, {}, function (err, result) {
        if (err) {
            console.log("userProvider.remove err: ", err);
            res.send({err:err});
        } else {
            console.log("userProvider.remove result: ", result);
            res.send({_id:req.params.attractionsID});
        }
    });
};
exports.getAllAttractionsByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var cityname = req.query.cityname;
    var attrname = req.query.attrname;
    var query = {checkFlag:'1'};
    if(!Util.isNull(cityname))
        query.cityname = cityname;
    if(!Util.isNull(attrname))
        query.attractions = {$regex:attrname};
    attractionsProvider.count(query, function (err, count) {
        attractionsProvider.find(query, {skip:skip, limit:req.params.pageLimit,sort:{'index_flag':-1,'show_flag':-1,'recommand_flag':-1}}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({attractions:result, count:count});
            }
        });
    });
};
exports.getAllUserCreateAttractionsByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var name = req.params.name;
    if (name != '' && name !== undefined) {
        attractionsProvider.count({cityname:name,checkFlag:'0'}, function (err, count) {
            attractionsProvider.find({cityname:name,checkFlag:'0'}, {skip:skip, limit:req.params.pageLimit}, function (err, result) {
                if (err) {
                    res.send({err:err});
                } else {
                    res.send({attractions:result, count:count});
                }
            });
        });
    } else {
        attractionsProvider.count({checkFlag:'0'}, function (err, count) {
            attractionsProvider.find({checkFlag:'0'}, {skip:skip, limit:req.params.pageLimit}, function (err, result) {
                if (err) {
                    res.send({err:err});
                } else {
                    res.send({attractions:result, count:count});
                }
            });
        });
    }
};
exports.checkattractions = function(req, res){
    attractionsProvider.update({_id:new ObjectID(req.params.attractionsID)}, {$set:{checkFlag:'1'}}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};
function getSubLabel(label, sblabel, callback) {
    var _id = label;
    labelProvider.findOne({'_id':new ObjectID(_id)}, {'label':1}, function (err, re) {
        if (err) {
            console.log(err);
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

exports.getAttractions = function (req, res) {
    if (req.params.attractionsID) {
        attractionsProvider.findOne({_id:new ObjectID(req.params.attractionsID)}, {}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                if (result.masterLabel) {
                    labelProvider.findOne({_id:new ObjectID(result.masterLabel)}, {}, function (err, data) {
                        if (err) {

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
                    res.send(result);
                }

            }
        });
    } else {
        attractionsProvider.find({}, {}, function (err, result) {
            if (err) {
                res.send({err:err});
                throw err;
            } else {
                res.send(result);
            }
        });
    }
};

exports.getAttractionsImage = function (req, res) {
    var imageID = req.params.imageId;
    if (imageID != 'undefined') {
        var path = global.imgpathAO + req.params.imageId;
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
exports.postimage = function (req, res) {
    var target_upload_name;
    // console.log(req.files.file.path);
    // console.log(req.files.file.type);
    // console.log(req.body._id);
    var _id = req.body._id || req.headers._id;
    if(req.files.file && _id){
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathAO + target_upload_name;
        var filePathA1 = global.imgpathA1 + target_upload_name;
        var filePathA2 = global.imgpathA2 + target_upload_name;
        var filePathA3 = global.imgpathA3 + target_upload_name;
        var filePathA4 = global.imgpathA4 + target_upload_name;
        var filePathA5 = global.imgpathA5 + target_upload_name;
        console.log(tmp_upload_path,target_upload_path);
        makeImageFile(req, tmp_upload_path, target_upload_path, filePathA1, filePathA2, filePathA3,filePathA4,filePathA5, function () {
            upyunClient.upAttractionToYun(target_upload_name,function(err,data){
                if(err) throw err;
                attractionsProvider.update({_id:new ObjectID(_id)}, {$push:{ 'image':target_upload_name}}, {safe:true}, function (err) {
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
    //原来的方法如下
    // if (req.files.upload && req.body._id) {
    //     var id = new ObjectID();
    //     var tmp_upload = req.files.upload;
    //     var tmp_upload_path = tmp_upload.path;
    //     var tmp_upload_type = tmp_upload.type;
    //     target_upload_name = validPic(tmp_upload_type);
    //     var target_upload_path = global.imgpathAO + target_upload_name;
    //     var filePathA1 = global.imgpathA1 + target_upload_name;
    //     var filePathA2 = global.imgpathA2 + target_upload_name;
    //     var filePathA3 = global.imgpathA3 + target_upload_name;
    //     var filePathA4 = global.imgpathA4 + target_upload_name;
    //     var filePathA5 = global.imgpathA5 + target_upload_name;
    //     makeImageFile(req, tmp_upload_path, target_upload_path, filePathA1, filePathA2, filePathA3,filePathA4,filePathA5, function () {
    //         upyunClient.upAttractionToYun(target_upload_name,function(err,data){
    //             if(err) throw err;
    //             attractionsProvider.update({_id:new ObjectID(req.body._id)}, {$push:{ 'image':target_upload_name}}, {safe:true}, function (err) {
    //                 if (err) {
    //                     throw err;
    //                 } else {
    //                     res.setHeader("Content-Type", "application/json");
    //                     res.json(target_upload_name);
    //                     res.end();
    //                 }
    //             });
    //         });
    //     });
    // } else {
    //     res.end();
    // }
};

function makeImageFile(req, tmp_path, target_path, target_path_A1, target_path_A2,target_path_A3, target_path_A4, target_path_A5, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        fs.unlink(tmp_path, function () {
            if (err) throw err;

            im.crop({srcPath:target_path,dstPath:target_path_A1,width:global.imgsizeA1.width,height:global.imgsizeA1.height,quality:1,gravity:'Center'}, function (err, metadata) {
                if (err) throw err;
                im.crop({srcPath:target_path,dstPath:target_path_A2,width:global.imgsizeA2.width,height:global.imgsizeA2.height,quality:1,gravity:'Center'}, function (err, metadata) {
                    if (err) throw err;
                    im.crop({srcPath:target_path,dstPath:target_path_A3,width:global.imgsizeA3.width,height:global.imgsizeA3.height,quality:1,gravity:'Center'}, function (err, metadata) {
                        if (err) throw err;
                        im.crop({srcPath:target_path,dstPath:target_path_A4,width:global.imgsizeA4.width,height:global.imgsizeA4.height,quality:1,gravity:'Center'}, function (err, metadata) {
                            if (err) throw err;
                            im.crop({srcPath:target_path,dstPath:target_path_A5,width:global.imgsizeA5.width,height:global.imgsizeA5.height,quality:1,gravity:'Center'}, function (err, metadata) {
                                if (err) throw err;
                                process.nextTick(callback);
                            });
                        });
                    });
                });
            });
        });
    });
};
function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return  _id + '.' + suffix;
}

exports.delUploadImage = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathAO + imageName, function () {
        fs.unlink(global.imgpathA1 + imageName, function () {
            fs.unlink(global.imgpathA2 + imageName, function () {
                fs.unlink(global.imgpathA3 + imageName, function () {
                    fs.unlink(global.imgpathA4 + imageName, function () {
                        fs.unlink(global.imgpathA5 + imageName, function () {
                            attractionsProvider.update({_id:new ObjectID(_id)}, {$pull:{ 'image':imageName}}, {safe:true}, function (err) {
                                if (err) throw err;
                                upyunClient.delAttractionFromYun(imageName,function(err,data){
                                    if(err) res.send({'status':'fail'});
                                    res.send({'status':'success'});
                                });
                            });
                        });
                    });
                });
            });
        });
    });

};
//废弃
function copyCoverImage(globalpath, strpath, despath, callback) {
    var fileReadStream = fs.createReadStream(globalpath + strpath);
    var fileWriteStream = fs.createWriteStream(globalpath + despath);
    fileReadStream.pipe(fileWriteStream);
    fileWriteStream.on('close', function () {
        callback();
    });
}
exports.setCoverImg = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    attractionsProvider.update({_id:new ObjectID(_id)}, {$set:{'coverImageName':imageName, "imgFlag":true}}, {safe:true}, function (err) {
        if (err) {
            throw err;
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json(imageName);
            res.end();
        }
    });
    // attractionsProvider.findOne({_id:new ObjectID(_id), 'coverImageName':{$exists:true}}, {}, function (err, result) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         if (result) {
    //             copyCoverImage(global.imgpathAO, imageName, result.coverImageName, function () {
    //                 copyCoverImage(global.imgpathA1, imageName, result.coverImageName, function () {
    //                     copyCoverImage(global.imgpathA2, imageName, result.coverImageName, function () {
    //                         copyCoverImage(global.imgpathA3, imageName, result.coverImageName, function () {
    //                             copyCoverImage(global.imgpathA4, imageName, result.coverImageName, function () {
    //                                 copyCoverImage(global.imgpathA5, imageName, result.coverImageName, function () {
    //                                     res.setHeader("Content-Type", "application/json");
    //                                     res.json(result.coverImageId);
    //                                     res.end();
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         } else {
    //             var suffix = imageName.split(".")[1];
    //             var cover_id = new ObjectID();
    //             var cover_name = cover_id + '.' + suffix;
    //             copyCoverImage(global.imgpathAO, imageName, cover_name, function () {
    //                 copyCoverImage(global.imgpathA1, imageName, cover_name, function () {
    //                     copyCoverImage(global.imgpathA2, imageName, cover_name, function () {
    //                         copyCoverImage(global.imgpathA3, imageName, cover_name, function () {
    //                             copyCoverImage(global.imgpathA4, imageName, cover_name, function () {
    //                                 copyCoverImage(global.imgpathA5, imageName, cover_name, function () {
    //                                     attractionsProvider.update({_id:new ObjectID(_id)}, {$set:{'coverImageName':cover_name, "imgFlag":true}}, {safe:true}, function (err) {
    //                                         if (err) {
    //                                             throw err;
    //                                         } else {
    //                                             res.setHeader("Content-Type", "application/json");
    //                                             res.json(cover_name);
    //                                             res.end();
    //                                         }
    //                                     });
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         }
    //     }
    // });
};
exports.updateAttractions = function (req, res) {
    var data = req.body;
    if (data.subLabel.length > 0) {
        var sub = [];
        for (var i = 0; i < data.subLabel.length; i++) {
            sub.push(data.subLabel[i]);
        }
    }
    data.subLabel = sub;
    data.createFlag = '0';
    var setJson = {
        cityname:req.body.cityname,
        attractions_en:req.body.attractions_en,
        address:req.body.address,
        price:req.body.price,
        opentime:req.body.opentime,
		dayornight:req.body.dayornight,
        website:req.body.website,
        telno:req.body.telno,
        attractions:req.body.attractions,
        introduce:req.body.introduce,
        tips:req.body.tips,
        short_introduce:req.body.short_introduce,
        recommand_flag:req.body.recommand_flag,
        recommand_duration:req.body.recommand_duration,
        traffic_info:req.body.traffic_info,
        show_flag:req.body.show_flag,
        index_flag:req.body.index_flag,
        masterLabel:req.body.masterLabel,
        subLabel:data.subLabel,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        am:req.body.am,
        pm:req.body.pm,
        ev:req.body.ev,
        createFlag:'0'
    };
    attractionsProvider.update({_id:new ObjectID(req.params.attractionsID)}, {$set:setJson}, {safe:true}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true, _id:req.params.attractionsID,user_id:req.session.user._id});
        }
    });
};

exports.upload = function (req, res) {
    var attractions_id = req.query.attractions_id;
    var imageID = new ObjectID();
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var imageName = imageID + '.' + fileExtention;
    var filePath = global.imgpathAO + imageName;
    var fileStream = fs.createWriteStream(filePath);
    var filePathA1 = global.imgpathA1 + imageName;
    var filePathA2 = global.imgpathA2 + imageName;
    var filePathA3 = global.imgpathA3 + imageName;
    var filePathA4 = global.imgpathA4 + imageName;
    var filePathA5 = global.imgpathA5 + imageName;
    req.pipe(fileStream);
    req.on('end', function () {

        im.crop({srcPath:filePath,dstPath:filePathA1,width:global.imgasizeA1.width,height:global.imgasizeA1.height,quality:1,gravity:'Center'},function (err, metadata) {
            if (err) throw err;
        });
        im.crop({srcPath:filePath,dstPath:filePathA2,width:global.imgasizeA2.width,height:global.imgasizeA2.height,quality:1,gravity:'Center'},function (err, metadata) {
            if (err) throw err;
        });
        im.crop({srcPath:filePath,dstPath:filePathA3,width:global.imgasizeA3.width,height:global.imgasizeA3.height,quality:1,gravity:'Center'}, function (err, metadata) {
            if (err) throw err;
        });
        im.crop({srcPath:filePath,dstPath:filePathA4,width:global.imgasizeA4.width,height:global.imgasizeA4.height,quality:1,gravity:'Center'},function (err, metadata) {
            if (err) throw err;
        });
        im.crop({srcPath:filePath,dstPath:filePathA5,width:global.imgasizeA5.width,height:global.imgasizeA5.height,quality:1,gravity:'Center'},function (err, metadata) {
            if (err) throw err;
        });

        attractionsProvider.findOne({_id:new ObjectID(attractions_id), 'coverImageId':null}, {}, function (err, result) {
            if (err) {
                throw err;
            } else {
                if (result) {
                    attractionsProvider.update({_id:new ObjectID(attractions_id)}, {$push:{'image':imageName}, $set:{'coverImageName':imageName, "imgFlag":true}}, {safe:true}, function (err, result) {
                        if (err) {
                            res.send({success:false});
                            throw err;
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    attractionsProvider.update({_id:new ObjectID(attractions_id)}, {$push:{ 'image':imageName}}, {safe:true}, function (err, result) {
                        if (err) {
                            res.send({success:false});
                            throw err;
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });

    });
};

exports.getAttractionsByLabelID = function (req, res) {
   attractionsProvider.find({masterLabel:req.params.labelID,cityname:req.params.cityName}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};

exports.addMasterLabelToAttractions = function(req,res){
    var data =  req.body;
    var labelId = data.labelId+'';
    var attractionsList = data.attractionsList;
    stringToObject(attractionsList,function(new_id){
        attractionsProvider.update({_id:{ $in: new_id } },{$set:{masterLabel:labelId}},{safe:true,multi:true},function(err){
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
exports.addSubLabelToAttractions = function(req,res){
    var data =  req.body;
    var labelIds = data.labelIds;
    var attractionsList = data.attractionsList;
    stringToObject(attractionsList,function(new_id){
        attractionsProvider.update({_id:{ $in: new_id } },{$set:{subLabel:labelIds}},{safe:true,multi:true},function(err){
            if(err) throw err;
            res.send('issuccess',true);
        });
    });
};

exports.getAttractionsByQuery = function(query,option,callback){
    attractionsProvider.find(query,option,callback);
};

exports.countByQuery = function(query,callback){
    attractionsProvider.count(query, callback);
};

exports.publishAttraction = function(_id,callback){
    attractionsProvider.update({_id:_id},{$set:{show_flag:'1'}},{safe:true,multi:true},function(err,new_one){
        if(err) callback(err);
        else callback(null,new_one);
    });
};

