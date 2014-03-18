var isInt = function(obj){
  if(obj){
    //必需是整数
    var reg = /^(-|\+)?\d+$/ ;
    return reg.test(obj);
  }else
    return false;
};

var trim = function(str){
	// 用正则表达式将前后空格    
    if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(/(^\s+)|(\s+$)/g,"");
};

var isNull = function(str){
	if(str==null ||str==undefined)
		return true;
	else
		return false;
};