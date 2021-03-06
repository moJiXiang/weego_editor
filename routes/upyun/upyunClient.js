var UPYun = require('./upyun').UPYun;

// Test code

// 初始化空间
var upyun = new UPYun("weegotest", "upload", "weego2013");

function upToYun(src_path_name,target_path_name,callback){
	var fs =  require('fs');
	var fileContent = fs.readFileSync(src_path_name);
	upyun.writeFile(target_path_name, fileContent, false, function(err, data){
	    if (err) {
	       callback(err);
	    }else
	    	callback(null,data);
	});
}

function delFromYun(target_path_name,callback){
	upyun.deleteFile(target_path_name, function(err,data){
		if(err)
			console.log(err);
		else
			callback(data);
	});
}

exports.upHotelToYun = function(fileName,callback){

	var src_path_name0 = global.imgpathDO + fileName;
	var target_path_name0 = global.hotelpathDO + fileName;
	var src_path_name1 = global.imgpathD1 + fileName;
	var target_path_name1 = global.hotelpathD1 + fileName;
	var src_path_name2 = global.imgpathD2 + fileName;
	var target_path_name2 = global.hotelpathD2 + fileName;
	var src_path_name3 = global.imgpathD3 + fileName;
	var target_path_name3 = global.hotelpathD3 + fileName;
	var src_path_name4 = global.imgpathD4 + fileName;
	var target_path_name4 = global.hotelpathD4 + fileName;
	
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name1,target_path_name1,function(err,data1){
			if(err) throw err;
			upToYun(src_path_name2,target_path_name2,function(err,data2){
				if(err) throw err;
				upToYun(src_path_name3,target_path_name3,function(err,data3){
					if(err) throw err;
					upToYun(src_path_name4,target_path_name4,function(err,data4){
						if(err) throw err;
						callback(null,data4);
					});
				});
			});
		});
	});
};

exports.delHotelFromYun = function(fileName,callback){
	var target_path_name0 = global.hotelpathDO + fileName;
	var target_path_name1 = global.hotelpathD1 + fileName;
	var target_path_name2 = global.hotelpathD2 + fileName;
	var target_path_name3 = global.hotelpathD3 + fileName;
	var target_path_name4 = global.hotelpathD4 + fileName;
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		delFromYun(target_path_name1, function(err,data1){
			if(err) throw err;
			delFromYun(target_path_name2, function(err,data2){
				if(err) throw err;
				delFromYun(target_path_name3, function(err,data3){
					if(err) throw err;
					delFromYun(target_path_name4, function(err,data4){
						if(err) throw err;
						callback(null,data4);
					});
				});
			});
		});
	});
};

exports.upAttractionToYun = function(fileName,callback){
	var src_path_name0 = global.imgpathAO + fileName;
	var target_path_name0 = global.attpathAO + fileName;
	var src_path_name1 = global.imgpathA1 + fileName;
	var target_path_name1 = global.attpathA1 + fileName;
	var src_path_name2 = global.imgpathA2 + fileName;
	var target_path_name2 = global.attpathA2 + fileName;
	var src_path_name3 = global.imgpathA3 + fileName;
	var target_path_name3 = global.attpathA3 + fileName;
	var src_path_name4 = global.imgpathA4 + fileName;
	var target_path_name4 = global.attpathA4 + fileName;
	var src_path_name5 = global.imgpathA5 + fileName;
	var target_path_name5 = global.attpathA5 + fileName;
	var src_ios = global.imgpathAIos + fileName;
	var ios_path = global.attpathAIos + fileName;

	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name1,target_path_name1,function(err,data1){
			if(err) throw err;
			upToYun(src_path_name2,target_path_name2,function(err,data2){
				if(err) throw err;
				upToYun(src_path_name3,target_path_name3,function(err,data3){
					if(err) throw err;
					upToYun(src_path_name4,target_path_name4,function(err,data4){
						if(err) throw err;
						upToYun(src_path_name5,target_path_name5,function(err,data5){
							if(err) throw err;
							upToYun(src_ios, ios_path, function(err, data6) {
								if(err) throw err;
								callback(null, data6);
							});
						});
					});
				});
			});
		});
	});
};

exports.delAttractionFromYun = function(fileName,callback){
	var target_path_name0 = global.attpathAO + fileName;
	var target_path_name1 = global.attpathA1 + fileName;
	var target_path_name2 = global.attpathA2 + fileName;
	var target_path_name3 = global.attpathA3 + fileName;
	var target_path_name4 = global.attpathA4 + fileName;
	var target_path_name5 = global.attpathA5 + fileName;
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		delFromYun(target_path_name1, function(err,data1){
			if(err) throw err;
			delFromYun(target_path_name2, function(err,data2){
				if(err) throw err;
				delFromYun(target_path_name3, function(err,data3){
					if(err) throw err;
					delFromYun(target_path_name4, function(err,data4){
						if(err) throw err;
						delFromYun(target_path_name5, function(err,data5){
							if(err) throw err;
							callback(null,data5);
						});
					});
				});
			});
		});
	});
};
//这里没有citypathC1
exports.upCityToYun = function(fileName,callback){
	var src_path_name0 = global.imgpathCO + fileName;
	var target_path_name0 = global.citypathCO + fileName;
	var src_path_name2 = global.imgpathC2 + fileName;
	var target_path_name2 = global.citypathC2 + fileName;
	var src_path_name3 = global.imgpathC3 + fileName;
	var target_path_name3 = global.citypathC3 + fileName;
	var src_ios_name = global.imgpathCIos + fileName;
	var ios_path = global.citypathIos + fileName;

	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name2,target_path_name2,function(err,data1){
			if(err) throw err;
			upToYun(src_path_name3,target_path_name3,function(err,data2){
				if(err) throw err;
				upToYun(src_ios_name, ios_path, function(err, data3) {
					callback(null,data2);
				})
			});
		});
	});
};
//这里没有citypathC1
exports.delCityFromYun = function(fileName,callback){
	var target_path_name0 = global.citypathCO + fileName;
	var target_path_name2 = global.citypathC2 + fileName;
	var target_path_name3 = global.citypathC3 + fileName;
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		delFromYun(target_path_name2, function(err,data1){
			if(err) throw err;
			delFromYun(target_path_name3, function(err,data2){
				if(err) throw err;
				callback(null,data2);
			});
		});
	});
};

//citypathC1
exports.upCityBgToYun = function(fileName,callback){
	var src_path_name1 = global.imgpathC1 + fileName;
	var target_path_name1 = global.citypathC1 + fileName;
	upToYun(src_path_name1,target_path_name1,function(err,data0){
		if(err) throw err;
		callback(null,data0);
	});
};
//citypathC1
exports.upImgforAppToYun = function(fileName,callback){
	var src_path_name1 = global.imgpathC4 + fileName;
	var target_path_name1 = global.citypathC4 + fileName;
	
	upToYun(src_path_name1,target_path_name1,function(err,data0){
		if(err) console.log('fail to upImgforAppToYun, error is ' + err);
		callback(null,data0);
	});
};
//citypathC1
exports.delCityBgFromYun = function(fileName,callback){
	var target_path_name1 = global.citypathC1 + fileName;
	delFromYun(target_path_name1, function(err,data0){
		if(err) throw err;
		callback(null,data0);
	});
};

exports.upLifeToYun = function(type,fileName,callback){
	var src_path_name0 = getSrcPathByType(type) + fileName;
	var target_path_name0 = getTargetPathByType(type) + fileName;
	var ios_src = getIosSrcPathByType(type) + fileName;
	var ios_path = getIosPathByType(type) + fileName;

	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(ios_src,ios_path,function(err,data0){
			if(err) throw err;
			callback(null,data0);
		});
	});
};

exports.delLifeFromYun = function(type,fileName,callback){
	var target_path_name0 = getTargetPathByType(type) + fileName;
	
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		callback(null,data0);
	});
};

exports.upAreaToYun = function(fileName, callback){
	var src_path = global.imgpathSO + fileName;
	var target_path = global.lifepathAO + fileName;
	var ios_src_path = global.imgpathSIos + fileName;
	var ios_path = global.lifepathIosAO + fileName;
	upToYun(src_path, target_path, function(err, result){
		if(err){
			callback(err)
		};
		upToYun(ios_src_path, ios_path, function(err, data) {
			if(err){
				callback(err)
			};
			callback(null, data);
		})
	})
}

exports.delAreaFromYun = function(fileName, callback){
	var target_path = global.lifepathAO + fileName;

	delFromYun(target_path, function(err, data0){
		if(err) throw err;
		callback(null, data0);
	})
}

function getSrcPathByType (type){
    if(type=='1')
        return global.imgpathEO;
    else if(type=='2')
        return global.imgpathFO;
    else
        return global.imgpathGO;
}
function getIosSrcPathByType(type) {
	 if(type=='1')
        return global.imgpathEIos;
    else if(type=='2')
        return global.imgpathFIos;
}
function getTargetPathByType (type){
    if(type=='1')
        return global.lifepathEO;
    else if(type=='2')
        return global.lifepathFO;
    else
        return global.lifepathGO;
}

function getIosPathByType(type) {
	if(type == '1') {
		return global.lifepathIosEO;
	} else if(type == '2') {
		return global.lifepathIosFO;
	}
}