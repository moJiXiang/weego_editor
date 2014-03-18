exports.isNull = function(str){
    if(str==null || str=='' || str==undefined)
        return true;
    else{
        return false;
    }
};

exports.trim = function(content){  
    // 用正则表达式将前后空格    
    if(content==null || content==undefined)
        return '';
    else
        return content.replace(/(^\s+)|(\s+$)/g,"");
};