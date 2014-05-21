// global.mongodbHost = '192.168.1.103';
global.mongodbHost = 'localhost';
global.mongodbPort = 27017;
global.mongodbDB = 'travel1';//travel
global.listenerPort = 3003;
global.db = 'mongodb://localhost/travel1',

//global.imgasizeMiddle = "572x176";
//global.imgasizeSmall = "266x176";
//global.imgasizeBig = "572x508";
//global.imgasize81 = "81x81";

global.imgsizeC1 = {width:1000,height:400};
global.imgsizeC2 = {width:441,height:446};
global.imgsizeC3 = {width:290,height:177};

global.imgsizeA1 = {width:610,height:504};
global.imgsizeA2 = {width:533,height:368};
global.imgsizeA3 = {width:610,height:177};
global.imgsizeA4 = {width:290,height:177};
global.imgsizeA5 = {width:85,height:85};

global.imgsizeD1 = {width:744,height:464};
global.imgsizeD2 = {width:314,height:300};
global.imgsizeD3 = {width:380,height:240};
global.imgsizeD4 = {width:93,height:50};



//本地测试地址
//global.imgpath = '/Users/wanzhang/weego/weego/attractions/origin/';
//global.imgpathBig = '/Users/wanzhang/weego/weego/attractions/572*508/';
//global.imgpathSmall = '/Users/wanzhang/weego/weego/attractions/266*176/';
//global.imgpathMiddle = '/Users/wanzhang/weego/weego/attractions/572*176/';
//global.imgpath81 = '/Users/wanzhang/weego/weego/attractions/81*81/';
//global.imIdentifyPath = "/usr/local/bin/identify";
//global.imConvertPath = "/usr/local/bin/convert";

//服务器测试地址
//global.imgpath = '/srv/weego/attractions/origin/';
//global.imgpathBig = '/srv/weego/attractions/572*508/';
//global.imgpathSmall = '/srv/weego/attractions/266*176/';
//global.imgpathMiddle = '/srv/weego/attractions/572*176/';
//global.imgpath81 = '/srv/weego/attractions/81*81/';
//景点 server 的地址
 global.imgpathAO = '/srv/weego/attractions/origin/';
 global.imgpathA1 = '/srv/weego/attractions/imgsizeA1/';
 global.imgpathA2 = '/srv/weego/attractions/imgsizeA2/';
 global.imgpathA3 = '/srv/weego/attractions/imgsizeA3/';
 global.imgpathA4 = '/srv/weego/attractions/imgsizeA4/';
 global.imgpathA5 = '/srv/weego/attractions/imgsizeA5/';
//global.imgpathAO = 'c:/weego/attractions/origin/';
//global.imgpathA1 = 'c:/weego/attractions/imgsizeA1/';
//global.imgpathA2 = 'c:/weego/attractions/imgsizeA2/';
//global.imgpathA3 = 'c:/weego/attractions/imgsizeA3/';
//global.imgpathA4 = 'c:/weego/attractions/imgsizeA4/';
//global.imgpathA5 = 'c:/weego/attractions/imgsizeA5/';

//景点 upyun 的地址
global.attpathAO = '/attractions/origin/';
global.attpathA1 = '/attractions/imgsizeA1/';
global.attpathA2 = '/attractions/imgsizeA2/';
global.attpathA3 = '/attractions/imgsizeA3/';
global.attpathA4 = '/attractions/imgsizeA4/';
global.attpathA5 = '/attractions/imgsizeA5/';

//city server地址
 global.imgpathCO = '/srv/weego/city/origin/';
 global.imgpathC1 = '/srv/weego/city/imgsizeC1/';
 global.imgpathC2 = '/srv/weego/city/imgsizeC2/';
 global.imgpathC3 = '/srv/weego/city/imgsizeC3/';
//global.imgpathCO = 'c:/weego/city/origin/';
//global.imgpathC1 = 'c:/weego/city/imgsizeC1/';
//global.imgpathC2 = 'c:/weego/city/imgsizeC2/';
//global.imgpathC3 = 'c:/weego/city/imgsizeC3/';
//city upyun地址
global.citypathCO = '/city/origin/';
global.citypathC1 = '/city/imgsizeC1/';
global.citypathC2 = '/city/imgsizeC2/';
global.citypathC3 = '/city/imgsizeC3/';

//global.imgpathDO = '/srv/weego/hotels/imgpathDO/';//生产：
global.imgpathDO = '/srv/weego/hotels/imgpathDO/';//生产：
global.imgpathD1 = '/srv/weego/hotels/imgpathD1/';//生产：
global.imgpathD2 = '/srv/weego/hotels/imgpathD2/';//生产：
global.imgpathD3 = '/srv/weego/hotels/imgpathD3/';//生产：
global.imgpathD4 = '/srv/weego/hotels/imgpathD4/';//生产：
// global.imgpathDO = '/srv/weego/hotels/imgpathDO/';//生产：
// global.imgpathD1 = '/srv/weego/hotels/imgpathD1/';//生产：
// global.imgpathD2 = '/srv/weego/hotels/imgpathD2/';//生产：
// global.imgpathD3 = '/srv/weego/hotels/imgpathD3/';//生产：
// global.imgpathD4 = '/srv/weego/hotels/imgpathD4/';//生产：

//hotel服务器上地址
//global.imgpathDO = 'c:/weego/origin/';  //原始
//global.imgpathD1 = 'c:/weego/imgpathD1/';  //464*744
//global.imgpathD2 = 'c:/weego/imgpathD2/';  //300*314
//global.imgpathD3 = 'c:/weego/imgpathD3/';  //240*380
//global.imgpathD4 = 'c:/weego/imgpathD4/';  //50*93

//hotel upyun 的地址
global.hotelpathDO = '/hotel/origin/';
global.hotelpathD1 = '/hotel/imgpathD1/';
global.hotelpathD2 = '/hotel/imgpathD2/';
global.hotelpathD3 = '/hotel/imgpathD3/';
global.hotelpathD4 = '/hotel/imgpathD4/';

 global.imIdentifyPath = "/usr/bin/identify";
 global.imConvertPath = "/usr/bin/convert";
//life服务器上地址
global.imgpathEO = 'c:/weego/restaurants/origin/';  //原始
global.imgpathFO = 'c:/weego/shoppings/origin/';  //原始
global.imgpathGO = 'c:/weego/entertainments/origin/';  //原始
//global.imgpathEO = '/srv/weego/restaurants/origin';  //原始
//global.imgpathFO = '/srv/weego/shoppings/origin';  //原始
//global.imgpathGO = '/srv/weego/entertainments/origin';  //原始

//life upyun 的地址
global.lifepathEO = '/restaurant/origin/';
global.lifepathFO = '/shopping/origin/';
global.lifepathGO = '/entertainment/origin/';

// global.imIdentifyPath = "/usr/bin/identify";
// global.imConvertPath = "/usr/bin/convert";

//global.imIdentifyPath = "C:/Program Files/ImageMagick-6.8.7-Q16/identify";
//global.imConvertPath = "C:/Program Files/ImageMagick-6.8.7-Q16/convert";
