var Category = require('../proxy').Category;
var Lifetag = require('../proxy').Lifetag;
var Area = require('../proxy').Area;
var ObjectID = require('mongodb').ObjectID;
var Restaurant = require('../proxy').Restaurant;
var Shopping = require('../proxy').Shopping;
var Entertainment = require('../proxy').Entertainment;
var upyunClient = require('./upyun/upyunClient');
var Util = require('./util');
var fs = require('fs');
var gm = require('gm')
,   imageMagick = gm.subClass({ imageMagick: true });

exports.getCategory = function(req,res){
	Category.getCategory(new ObjectID(req.params.categoryId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getCategoryByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var  type = req.params.type;
    if(!type)
        type = '1';
    Category.count(type, function (err, count) {
        Category.getCategorysByTypeLimit(type,skip,req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({categorys:result, count:count});
            }
        });
    });
};

exports.getCategorysByQuery = function(req,res){
    var type = req.params.type;
    var name = req.params.name;
    var query = {};
    if(type){
        query.type = type;
    }
    if(!Util.isNull(name)){
        if(Util.trim(name)!=""){
            query.name = {$regex:name};
        }   
    }
     
    Category.getCategorysByQuery(query,function(err,categorys){
        if(err)
            res.send({err:err});
        else
            res.send({result:categorys});
    });
},

exports.removeCategory = function(req, res){
    Category.getCategory(new ObjectID(req.params.categoryId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
			if(result){
				result.remove();
			}
			res.send({_id:req.params.categoryId});
        }
    });
};

exports.addNewCategory = function(req, res){
    var category = req.body;
    Category.newAndSave(category.type,category.name,category.en_name,  function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateCategory = function(req, res){
    var json = req.body;
    Category.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

//---------------------------lifetag---------------------------------------------

exports.getLifetag = function(req,res){
    Lifetag.getLifetag(new ObjectID(req.params.lifetagId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getLifetagByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var  type = req.params.type;
    if(!type)
        type = '1';
    Lifetag.count(type, function (err, count) {
        Lifetag.getLifetagsByTypeLimit(type,skip,req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({lifetags:result, count:count});
            }
        });
    });
};

exports.getLifetagsByType = function(req,res){
    Lifetag.getLifetagsByType(req.params.type,function(err,lifetags){
        if(err)
            res.send({err:err});
        else
            res.send({result:lifetags});
    });
},

exports.removeLifetag = function(req, res){
    Lifetag.getLifetag(new ObjectID(req.params.lifetagId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.lifetagId});
        }
    });
};

exports.addNewLifetag = function(req, res){
    var lifetag = req.body;
    Lifetag.newAndSave(lifetag.type,lifetag.name,  function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateLifetag = function(req, res){
    var json = req.body;
    Lifetag.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

//---------------------------area---------------------------------------------

exports.getArea = function(req,res){
    Area.getArea(new ObjectID(req.params.areaId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getAreaByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Area.count( function (err, count) {
        Area.getAreasByLimit(skip,req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({areas:result, count:count});
            }
        });
    });
};

exports.getAreasByCityId = function(req,res){
    var query = {city_id:new ObjectID(req.params.cityId+'')};
    Area.getAreasByQuery(query,function(err,areas){
        if(err){
            res.send({status:false,err:err});
        }else{
            res.send({status:true,results:areas});
        }
    });
};
exports.getAreasByCityName = function(req,res){
    var query = {city_name:req.params.cityName};
    Area.getAreasByQuery(query,function(err,areas){
        if(err){
            res.send({status:false,err:err});
        }else{
            res.send({status:true,results:areas});
        }
    });
};

exports.removeArea = function(req, res){
    Area.getArea(new ObjectID(req.params.areaId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.areaId});
        }
    });
};

exports.addNewArea = function(req, res){
    var area = req.body;
    console.log(area);
    Area.newAndSave(area,  function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateArea = function(req, res){
    var json = req.body;
    Area.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

//-----------------------------------restaurant-----------------------------------

// exports.getRestaurant = function(req, res){
//     Restaurant.getRestaurantsByQuery({_id : req.params.restaurantId}, function (err, result) {
//         if (err) {
//             res.send({err:err});
//         } else {
//             console.log("====================================================");
//             console.log(result);
//             res.send(result);
//         }
//     });
// };
exports.getRestaurant = function(req, res){
    Restaurant.getRestaurantsByQuery(new ObjectID(req.params.restaurantId+''), function (err, result) {
        if (err) {
            console.log(err);
            res.send({err:err});
        } else {
            console.info(result);
            res.send(result);
        }
    });
};
exports.getRestaurantsByFlag = function(req, res) {
    var lifename = req.query.lifename;
    var cityname = req.query.cityname,
        most_popular = req.query.most_popular,
        best_dinnerchoics = req.query.best_dinnerchoics,
        michilin_flag = req.query.michilin_flag,
        local_flag = req.query.local_flag;
    var con = {};
    if (lifename) {
        con.name = {
            $regex: Util.trim(lifename)
        };
    }
    if (cityname) {
        con.city_name = Util.trim(cityname);
    }
    if (most_popular != '') {
        con.most_popular = most_popular;
    }
    if (best_dinnerchoics != '') {
        con.best_dinnerchoics = best_dinnerchoics;
    }
    if (michilin_flag != '') {
        con.michilin_flag = michilin_flag;
    }
    if (local_flag != '') {
        con.local_flag = local_flag;
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Restaurant.count(con,function (err, count) {
        Restaurant.getRestaurants(skip,req.params.pageLimit,con, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({results:result, count:count});
            }
        });
    });
}

exports.getRestaurantByPage = function (req, res) {
    var lifename = req.query.lifename,
        cityname = req.query.cityname,
        pagelimit = req.params.pageLimit,
        tags = req.query.tags;
        console.log(tags);
    var con = {};
    var tagsArr = [];
    if(lifename){
        con.name = {$regex:Util.trim(lifename)};
    }
    if(cityname){
        con.city_name = Util.trim(cityname);
    }
    if(tags){
        tagsArr = tags.split(",");
        if(tagsArr[0] == ""){
            tagsArr.splice(0,1);
        }
        con.tags = {$all: tagsArr};
    }
    var skip = pagelimit * (req.params.pageIndex - 1);
    Restaurant.count(con,function (err, count) {
        Restaurant.getRestaurants(skip,pagelimit,con, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({results:result, count:count});
            }
        });
    });
};

exports.removeRestaurant = function(req, res){
    Restaurant.getRestaurant(new ObjectID(req.params.restaurantId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.restaurantId});
        }
    });
};

exports.addNewRestaurant = function(req, res){
    var restaurant = JSON.parse(req.body);
    Restaurant.newAndSave(restaurant,  function (err, result) {
        if (err) {
            throw err;
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id,user_id:req.session.user._id});
        }
    });
};

exports.updateRestaurant = function(req, res){
    var json = req.body;
    Restaurant.update(json,function(err,result){
        if (err) {
             res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id,user_id:req.session.user._id});
        }
    });
};

exports.publishRestaurant = function(_id,callback){
    Restaurant.updateShowFlag(_id,true,callback);
};

//-----------------------------------shopping-----------------------------------

exports.getShopping = function(req, res){
    console.log("full shoppinglllllllllllllllll");
    Shopping.getFullShopping(new ObjectID(req.params.shoppingId+''), function (err, result) {
        if (err) {
            console.log(err);
            res.send({err:err});
        } else {
            console.info(result);
            res.send(result);
        }
    });
};

exports.getShoppingByPage = function (req, res) {
    var lifename = req.query.lifename;
    var cityname = req.query.cityname;
    var areaname = req.query.areaname;
    var con = {};
    if(lifename){
        con.name = {$regex:Util.trim(lifename)};
    }
    if(cityname){
        con.city_name = {$regex:Util.trim(cityname)};
    }
    if (areaname) {
        con.$or = [{area_name : areaname},{area_enname : areaname}];
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Shopping.count(con,function (err, count) {
        console.log(count);
        Shopping.getShoppings(skip,req.params.pageLimit,con, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                console.log("=====================");
                console.log(result);
                res.send({results:result, count:count});
            }
        });
    });
};

exports.getBigShoppingByCityId = function(req,res){
    var cityId = req.params.cityId;
    var query = {city_id:new ObjectID(cityId+'')};
    query.is_big = true;
    Shopping.getShoppingsByQuery(query,function(err,shoppings){
        if (err) {
            res.send({status:false,err:err});
        } else {
            res.send({status:true,results:shoppings});
        }
    });
};

exports.removeShopping = function(req, res){
    Shopping.getShopping(new ObjectID(req.params.shoppingId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.shoppingId});
        }
    });
};

exports.addNewShopping = function(req, res){
    var shopping = req.body;
    Shopping.newAndSave(shopping,  function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id,user_id:req.session.user._id});
        }
    });
};

exports.updateShopping = function(req, res){
    var json = req.body;
    Shopping.update(json,function(err,result){
        if (err) {
             res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id,user_id:req.session.user._id});
        }
    });
};

exports.publishShopping = function(_id,callback){
    Shopping.updateShowFlag(_id,true,callback);
};

//-----------------------------------entertainment-----------------------------------

exports.getEntertainment = function(req, res){
    Entertainment.getEntertainment(new ObjectID(req.params.entertainmentId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};

exports.getEntertainmentByPage = function (req, res) {
    var lifename = req.query.lifename;
    var cityname = req.query.cityname;
    var con = {};
    if(lifename){
        con.name = {$regex:Util.trim(lifename)};
    }
    if(cityname){
        con.city_name = Util.trim(cityname);
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Entertainment.count(con,function (err, count) {
        Entertainment.getEntertainments(skip,req.params.pageLimit,con, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({results:result, count:count});
            }
        });
    });
};

exports.removeEntertainment = function(req, res){
    Entertainment.getEntertainment(new ObjectID(req.params.entertainmentId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.entertainmentId});
        }
    });
};

exports.addNewEntertainment = function(req, res){
    var entertainment = req.body;
    Entertainment.newAndSave(entertainment,  function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id,user_id:req.session.user._id});
        }
    });
};

exports.updateEntertainment = function(req, res){
    var json = req.body;
    Entertainment.update(json,function(err,result){
        if (err) {
             res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id,user_id:req.session.user._id});
        }
    });
};

exports.publishEntertainment = function(_id,callback){
    Entertainment.updateShowFlag(_id,true,callback);
};

//-----------------------------------image-----------------------------------------

// exports.postLifeImage = function(req,res){
//     var type = req.body._type || req.headers.type;
//     console.log(req.files,req.headers);
//     var _id = req.body._id || req.headers._id;
//     if(req.files.file && _id){
//         var id = new ObjectID();
//         var tmp_upload = req.files.file;
//         var tmp_upload_path = tmp_upload.path;
//         //新的图片上传插件需要的接口
//         var tmp_upload_type = tmp_upload.type;
//         var target_upload_name = validPic(tmp_upload_type);
//         var target_upload_path = getPathByType(type) + target_upload_name;
//         // var target_upload_path = './public/images/' + target_upload_name;
//         makeImageFile(req, tmp_upload_path, target_upload_path, function () {
//             upyunClient.upLifeToYun(type,target_upload_name,function(err,data){
//                 if(err) throw err;
//                 pushImg(_id,type,target_upload_name,function(err,result){
//                     if (err) {
//                         throw err;
//                     } else {
//                         res.setHeader("Content-Type", "application/json");
//                         res.json(target_upload_name);
//                         res.end();
//                     }
//                 });
//             });
//         });
//     } else {
//         res.end();
//     }
// };
exports.postLifeImage = function (req, res) {
    var type = req.headers.type;
    var resshopid = req.headers.resshopid;

    var filename = validPic(req.files.file.type);
    var tmp_path = req.files.file.path;
    var target_path = getPathByType(type) + filename;

    var cropwidth, cropheight, startx, starty;
    imageMagick(tmp_path)
        .size(function(err, size) {
            cropwidth = size.width >= size.height ? size.height * Math.ceil(640/425) : size.width;
            cropheight = size.width < size.height ? size.width * Math.ceil(425/640) : size.height;
            startx = size.width >= size.height ? Math.ceil((size.width - cropwidth) / 2) : 0;
            starty = size.width < size.height ? Math.ceil((size.height - cropheight)/2) : 0;

            imageMagick(tmp_path)
                .crop(cropwidth, cropheight, startx, starty)
                .resize(640, 425, "!")
                .autoOrient()
                .write(target_path, function(err) {
                    if (err) {
                        res.end();
                    }
                    upyunClient.upLifeToYun(type, filename, function(err, result) {
                        if (err) {
                            res.send({
                                status: '500',
                                message: 'can not upload file to upyunClient!'
                            });
                        }
                        pushImg(resshopid, type, filename, function(err, result) {
                            if (err) {
                                res.send({
                                    status: '500',
                                    message: 'can not push new image into the database!'
                                });
                            }
                            fs.unlink(tmp_path, function() {
                                res.send({
                                    status: '200',
                                    message: 'upload image success!'
                                });
                            });
                        })
                    })
                })
        })

    
}
// exports.uploadAreaImg = function(req, res) {
//     var _id = req.headers._id;
//     var tmp_path = req.files.file.path;
//     var filename  = req.files.file.name;
//     var target_path = global.imgpathSO + filename;
//     //移动文件
//     console.log(tmp_path + ", " + target_path);
//     fs.rename(tmp_path, target_path, function(err){
//         if(err) throw err;

//         upyunClient.upAreaToYun(filename, function(err, data) {
//             if(err) throw err;
//             Area.pushImg(_id, filename, function(err, result) {
//                 if(err) throw err;
//                 res.end();
//             })
//         });
//     })
// }

exports.uploadAreaImg = function(req, res) {
    var areaid = req.headers.areaid;
    var filename = validPic(req.files.file.type);
    var tmp_path = req.files.file.path;
    var target_path = global.imgpathSO + filename;
    var cropwidth, cropheight, startx, starty;
    imageMagick(tmp_path)
        .size(function(err, size) {
            cropwidth = size.width >= size.height ? size.height * Math.ceil(640/425) : size.width;
            cropheight = size.width < size.height ? size.width * Math.ceil(425/640) : size.height;
            startx = size.width >= size.height ? Math.ceil((size.width - cropwidth) / 2) : 0;
            starty = size.width < size.height ? Math.ceil((size.height - cropheight)/2) : 0;

            imageMagick(tmp_path)
                .crop(cropwidth, cropheight, startx, starty)
                .resize(640, 425, "!")
                .autoOrient()
                .write(target_path, function(err) {
                    if (err) {
                        res.end();
                    }

                    upyunClient.upAreaToYun(filename, function(err, result) {
                        if (err) {
                            res.send({status: '500', message: 'can not upload file to upyunClient!'});
                        }
                        Area.pushImg(areaid, filename, function(err, result) {
                            if (err) {
                                res.send({status: '500', message: 'can not push new image into the database!'});
                            }
                            res.send({status: '200', message: 'upload image success!'});
                        })
                    })
                })
        })
}

exports.delAreaImg = function(req, res) {
    var id = req.params.id;
    var imageName = req.params.imageName;
    var target_path = global.imgpathSO + imageName;
    fs.unlink(target_path, function(err){
        if(err){
            res.send({status: '500', message: 'can not push new image into the database!'});
        }
        upyunClient.delAreaFromYun(imageName, function(err, data) {
            if(err){
                res.send({status: '500', message: 'can not upload file to upyunClient!'});
            }
            res.send({status:'success'});
        })
    })
}

exports.setAreaCoverImg = function (req, res) {
    var imageName = req.params.imageName;
    var id = req.params.id;
    Area.setAreaCoverImg(id, imageName, function (err, result) {
        if (err) throw err;
        res.end();
    })
}

function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return  _id + '.' + suffix;
}

function makeImageFile(req, tmp_path, target_path, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        process.nextTick(callback);
    });
}

exports.delUploadImageLife = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    fs.unlink(getPathByType(type) + imageName, function () {
        pullImg(_id,type,imageName,function(err,result){
            if (err) throw err;
            upyunClient.delLifeFromYun(type,imageName,function(err,data){
                if(err) res.send({'status':'fail'});
                res.send({'status':'success'});
            });
        });
    });

};

exports.setCoverImgLife = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    setCoverImg(_id,type,imageName,function(err,result){
        if (err) {
            throw err;
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json(imageName);
            res.end();
        }
    });
};

function getPathByType (type){
    if(type=='1')
        return global.imgpathEO;
    else if(type=='2')
        return global.imgpathFO;
    else
        return global.imgpathGO;
}

function pushImg(_id,type,target_upload_name,callback){
    if(type=='1'){
        Restaurant.getRestaurant(new ObjectID(_id),function(err,result){
            if(result){
                result.image.push(target_upload_name);
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }else if(type=='2'){
        Shopping.getShopping(new ObjectID(_id),function(err,result){
            if(result){
                result.image.push(target_upload_name);
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }else {
        Entertainment.getEntertainment(new ObjectID(_id),function(err,result){
            if(result){
                result.image.push(target_upload_name);
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }
}

function pullImg (_id,type,target_upload_name,callback){
    if(type=='1'){
        Restaurant.getRestaurant(new ObjectID(_id),function(err,result){
            if(result){
                result.image.pull(target_upload_name);
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }else if(type=='2'){
        Shopping.getShopping(new ObjectID(_id),function(err,result){
            if(result){
                result.image.pull(target_upload_name);
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }else {
        Entertainment.getEntertainment(new ObjectID(_id),function(err,result){
            if(result){
                result.image.pull(target_upload_name);
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }
}

function setCoverImg (_id,type,cover_image,callback){
    if(type=='1'){
        Restaurant.getRestaurant(new ObjectID(_id),function(err,result){
            if(result){
                result.cover_image = cover_image;
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }else if(type=='2'){
        Shopping.getShopping(new ObjectID(_id),function(err,result){
            if(result){
                result.cover_image = cover_image;
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }else {
        Entertainment.getEntertainment(new ObjectID(_id),function(err,result){
            if(result){
                result.cover_image = cover_image;
                result.save(function(err){
                    callback(err,result);
                });
            }else{
                callback(err,result);
            }
        });
    }
}

