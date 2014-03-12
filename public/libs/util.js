var isInt = function(obj){
  if(obj){
    //必需是整数
    var reg = /^(-|\+)?\d+$/ ;
    return reg.test(obj);
  }else
    return false;
};