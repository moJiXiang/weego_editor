var Category = require('../proxy').Category;
var Lifetag = require('../proxy').Lifetag;
var Area = require('../proxy').Area;
var ObjectID = require('mongodb').ObjectID;
var Restaurant = require('../proxy').Restaurant;
var Shopping = require('../proxy').Shopping;
var Entertainment = require('../proxy').Entertainment;
var upyunClient = require('./upyun/upyunClient');
var Util = require('./util');

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

exports.getRestaurant = function(req, res){
    Restaurant.getRestaurantsByQuery(new ObjectID(req.params.restaurantId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
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
    console.log(con);
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
    var lifename = req.query.lifename;
    var cityname = req.query.cityname,
        most_popular = req.query.most_popular ,
        best_dinnerchoics = req.query.best_dinnerchoics ,
        michilin_flag = req.query.michilin_flag ,
        local_flag = req.query.local_flag ;
    var con = {};
    if(lifename){
        con.name = {$regex:Util.trim(lifename)};
    }
    if(cityname){
        con.city_name = Util.trim(cityname);
    }
    if(most_popular){
        con.most_popular = most_popular;
    }
    if(best_dinnerchoics){
        con.best_dinnerchoics = best_dinnerchoics;

    }
    if(michilin_flag){
        con.michilin_flag = michilin_flag;
        
    }
    if(local_flag){
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
    var restaurant = req.body;
    Restaurant.newAndSave(restaurant,  function (err, result) {
        if (err) {
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
    Shopping.getFullShopping(new ObjectID(req.params.shoppingId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
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
        con.city_name = Util.trim(cityname);
    }
    if (areaname) {
        con.$or = [{area_name : {$regex : areaname}, area_enname : {$regex : areaname}}];
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Shopping.count(con,function (err, count) {
        Shopping.getShoppings(skip,req.params.pageLimit,con, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
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

exports.postLifeImage = function(req,res){
    var type = req.body._type;
    if(req.files.file && req.body._id){
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;

        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upLifeToYun(type,target_upload_name,function(err,data){
                if(err) throw err;
                pushImg(req.body._id,type,target_upload_name,function(err,result){
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
        fs.unlink(tmp_path, function () {
            if (err) throw err;
            process.nextTick(callback);
        });
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

