/**
 * User: lb
 */

//---------------------------------model and collection-------------------------------------------------

var RestaurantModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/restaurant'
});
var ShoppingModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/shopping'
});
var EntertainmentModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/entertainment'
});
var LifeCollection = Backbone.Collection.extend({
    url: '/restaurants/'+this.pageLimit+'/'+this.currentPage,
    model: RestaurantModel,
    currentPage: 1,
    pageLimit: 10,
    cityname:'',
    lifename:'',
    type:'1',
    initialize: function(data){
        var type = '1';
        if(data && data.type)
            type = data.type;
        if(type=='1'){
            this.type='1';
            this.model = RestaurantModel;
            this.url = '/restaurants/'+this.pageLimit+'/'+this.currentPage;
        }else if(type == '2'){
            this.type='2';
            this.model = ShoppingModel;
            this.url = '/shoppings/'+this.pageLimit+'/'+this.currentPage;
        }else{
            this.type='3';
            this.model = EntertainmentModel;
            this.url = '/entertainments/'+this.pageLimit+'/'+this.currentPage;
        }
    },
    parse: function(response){
        this.total = response.count;
        return response.results;
    },
    hasPage: function(page){
        if(((page * this.pageLimit) - this.total) > this.pageLimit)
            return false;
        if(page == 0)
            return false;
        return true;
    },
    getByPage: function(limit, pageIndex,type, successCallback){
        if(type == null ||type == undefined || type =='')
            type = '1';
        if(type=='1'){
            this.type='1';
            this.model = RestaurantModel;
            this.url = '/restaurants/'+limit+'/'+pageIndex;
        }else if(type == '2'){
            this.type='2';
            this.model = ShoppingModel;
            this.url = '/shoppings/'+limit+'/'+pageIndex;
        }else{
            this.type='3';
            this.model = EntertainmentModel;
            this.url = '/entertainments/'+limit+'/'+pageIndex;
        }
        this.fetch({success: successCallback});
    },
    getFirstPage: function(type,callback){
        this.getByPage(this.pageLimit, 1,type, callback);
    },
    getNextPage: function(type,successCallback){
        if(!this.hasPage(this.currentPage + 1))
            return;
        this.getByPage(this.pageLimit, ++this.currentPage, type, successCallback);
    },
    getPrevPage: function(type,successCallback){
        if(!this.hasPage(this.currentPage - 1))
            return;
        this.getByPage(this.pageLimit, --this.currentPage, type, successCallback);
    },
    getPage: function(page,type, successCallback){
        this.currentPage = page;
        this.getByPage(this.pageLimit, this.currentPage, type, successCallback);
    }
});



//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var LifeView = Backbone.View.extend({
    template: Handlebars.compile($('#lifeDetailView').html()),
    initialize: function(){
        // alert('');
    },
    events: {
        'change #property-type': 'selectType',
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'click #save': 'saveLife',
        'click #top_save':'saveLife',
        'click #cancel': 'back',
        'focus #addCategoryValue':'autogetCategory',
        'click #addCategory':'addCategory',
        'focus #addLifetagValue':'autogetLifetag',
        'click #addLifetag':'addLifetag',
        'click #addOpentime':'addOpentime',
        'click .li-del':'delLi'
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    selectType: function(){
        var type =$('#property-type').val();
        if(type=='1'){
            $('#service-set').css('display','block');
            $('#rating_food_trust_span').css('display','block');
        }
        else if(type=='2'){
            $('#service-set').css('display','none');
            $('#rating_food_trust_span').css('display','block');
        }else{
            $('#service-set').css('display','none');
             $('#rating_food_trust_span').css('display','none');
        }
            
    },
    selectContinent: function(){
        var continentCode =  $("#continents_select").val();
        $.ajax({
            url:"/getCountriesByContinent/"+continentCode,
            success:function (data) {
                if(data.status){
                    var countries = data.countries;
                    var option = '';
                    for(var i=0;i<countries.length;i++){
                        var country = countries[i];
                        option +='<option value="'+country.code+'">'+country.cn_name+'</option>';
                    }
                    $('#country_select').html(option);
                }else{
                    alert('数据库异常！');
                }
            }
                
        });
    },
    selectCountry: function(){
        var countryCode =  $("#country_select").val();
        $.ajax({
            url:"/getCityByCountry/"+countryCode,
            success:function (data) {
                if(data.status){
                    var cities = data.cities;
                    var option = '';
                    for(var i=0;i<cities.length;i++){
                        var city = cities[i];
                        option +='<option value="'+city._id+'">'+city.cityname+'</option>';
                    }
                    $('#city_select').html(option);
                }else{
                    alert('数据库异常！');
                }
            }
        });
    },
    selectCity:function(){
        var cityname =  $("#city_select").find("option:selected").text();
        $("#city").val(cityname);
    },
    autogetCategory:function (e) {
        var _this = this;
        var type =$('#property-type').val();
        $("#addCategoryValue").autocomplete({
            source:function (request, response) {
                $.ajax({
                    url:"/getCategorysByType/"+type,
                    dataType:"json",
                    data:request,
                    success:function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label:item.name,
                                        value:item.name,
                                        _id:item._id
                                    }
                                }));
                    }
                });
            },
            select:function (event, ui) {
                $("#addCategoryValue").attr('value',ui.item.label);
                $("#addCategoryValue").attr('data-value', ui.item._id);
            }
        });
    },
    addCategory:function(){
        var itemName = $('#addCategoryValue').val();
        var itemId = $('#addCategoryValue').attr('data-value');
        if(itemId && itemName){
           var $newitem = $('<li><input class="input-xlarge focused categorys" readonly style="width:100px" name="categorys" '+
            'type="text" value="'+itemName+'" data-value="'+itemId+'"> <input type="button" value="删除" class="li-del"><li>');
            $('#category-list').last().after($newitem); 
        }else{
            alert('请不手动输入！');
        }
        
    },
    addOpentime:function(){
        var open_day = $('#open-day').val();
        var open_time_begin = $('#open-time-begin').val();
        var open_time_end = $('#open-time-end').val();
        if(open_time_begin!='allday' && open_time_begin!='close' &&
            open_time_end!='allday' && open_time_end!='close' &&
            open_time_end < open_time_begin){
            alert('请正确选择！');
            return false;
        }
        var open_time = {
            desc : $('#open-day').find("option:selected").text()+' '+this.getOpenTimeDesc(),
            value : open_day+'-'+open_time_begin+'-'+open_time_end
        };
       var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" '+
        'type="text" value="'+open_time.desc+'" data-value="'+open_time.value+'"> <input type="button" value="删除" class="li-del"><li>');
        $('#opentime-list').last().after($newitem);
    },
    getOpenTimeDesc :function(){
        var open_time_begin = $('#open-time-begin').val();
        var open_time_end = $('#open-time-end').val();
        if(open_time_begin=='allday'||open_time_end=='allday')
            return '全天';
        else if(open_time_begin=='close'||open_time_end=='close')
            return '关门';
        else
            return $('#open-time-begin').find("option:selected").text()+'-'+$('#open-time-end').find("option:selected").text();
    },
    autogetLifetag:function (e) {
        var _this = this;
        var type =$('#property-type').val();
        $("#addLifetagValue").autocomplete({
            source:function (request, response) {
                $.ajax({
                    url:"/getLifetagsByType/"+type,
                    dataType:"json",
                    data:request,
                    success:function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label:item.name,
                                        value:item.name,
                                        _id:item._id
                                    }
                                }));
                    }
                });
            },
            select:function (event, ui) {
                $("#addLifetagValue").attr('value',ui.item.label);
                $("#addLifetagValue").attr('data-value', ui.item._id);
            }
        });
    },
    addLifetag:function(){
        var itemName = $('#addLifetagValue').val();
        var itemId = $('#addLifetagValue').attr('data-value');
        if(itemId && itemName){
           var $newitem = $('<li><input class="input-xlarge focused lifetags" readonly style="width:100px" name="lifetags" '+
            'type="text" value="'+itemName+'" data-value="'+itemId+'"> <input type="button" value="删除" class="li-del"><li>');
            $('#lifetag-list').last().after($newitem); 
        }else{
            alert('请不手动输入！');
        }
        
    },
    delLi:function(e){
        $(e.target).parent().remove();
    },
    back: function(){
        console.log('back!');
        window.history.back();
    },
    getTextInputValue: function(id){
        return this.$el.find('#'+id).val();
    },
    saveLife: function(e){
        e.preventDefault();

        var type = $('#property-type').val();
        var categorys = [];
        for(var i=0;i<$('.categorys').length;i++){
            var item = {};
            item._id = $('.categorys').eq(i).attr('data-value');
            item.name = $('.categorys').eq(i).attr('value');
            categorys.push(item);
        }
        var lifetags = [];
        for(var i=0;i<$('.lifetags').length;i++){
            var item = {};
            item._id = $('.lifetags').eq(i).attr('data-value');
            item.name = $('.lifetags').eq(i).attr('value');
            lifetags.push(item);
        }
        var opentimes = [];
        for(var i=0;i<$('.opentimes').length;i++){
            var item = {};
            item.value = $('.opentimes').eq(i).attr('data-value');
            item.desc = $('.opentimes').eq(i).attr('value');
            opentimes.push(item);
        }
        var item = {
            name : $('#name').val(),
            address : $('#address').val(),
            tel : $('#tel').val(),
            city_name : $('#city_select').find("option:selected").text(),
            city_id : $('#city_select').val(),
            latitude : $('#latitude').val(),
            longitude : $('#longitude').val(),
            postal_code : $('#postal_code').val(),
            introduce : $('#introduce').val(),
            show_flag : $('#show_flag').prop('checked'),
            price_level : $('#price_level').val(),
            price_desc : $('#price_desc').val(),
            url : $('#url').val(),
            category: categorys,
            lifetag:lifetags,
            open_time:opentimes
        };
        if(type=='1'){
            var info = {
                wifi: $('#wifi').prop('checked'),
                yu_ding: $('#wifi').prop('checked'),
                delivery: $('#delivery').prop('checked'),
                take_out: $('#take_out').prop('checked'),
                card: $('#card').prop('checked'),
                g_f_kid: $('#g_f_kid').prop('checked'),
                g_f_group: $('#g_f_group').prop('checked'),
                out_seat: $('#out_seat').prop('checked'),
                tv: $('#tv').prop('checked'),
                waiter: $('#waiter').prop('checked'),
                g_for : $('#g_for').val(),
                noise : $('#noise').val(),
                alcohol: $('#alcohol').val(),
            };
            item.info = info;
        }
        if(item.name=='' || item.name==null || item.name==undefined){
            alert('名称不能为空！');
            $('#name').focus();
            return false;
        }

        if(!isInt(item.price_level)){
            alert('价格level必须是1,2,3,4,5');
            $('#price_level').focus();
            return false;
        }

        if(item.city_id==''||item.city_id==null || item.city_id==undefined){
            alert('城市不能为空！');
            $('#city_select').focus();
            return false;
        }
        
        if(this.model == null || this.model.get('_id') == null)
        {
            if(type=='1')
                this.model = new RestaurantModel(item);
            else if(type=='2')
                this.model = new ShoppingModel(item);
            else 
                this.model = new EntertainmentModel(item);
            this.model.save({},{
                success:function(model, res){
                    if(res.isSuccess){
                        alert('添加成功');
                        self.location = '/#lifes/1/'+type; 
                    }else{
                        alert('保存失败'+res.info);
                    }
                    
                }
            });
        }
        else{
            this.model.save(item, {
                success:function(model, res){
                    if(res.isSuccess){
                        alert('修改成功');
                        self.location = '/#lifes/1/'+type; 
                    }else{
                        alert('修改失败'+res.info);
                    }
                    
                }
            });
        }
    }
});

var LifeListView = Backbone.View.extend({
    template: Handlebars.compile($('#life-list-view').html()),
    events:{
        'click #life-list-prev-page': 'showPrevPage',
        'click #life-list-next-page': 'showNextPage',
        'change #life_type': 'selectType'
    },
    initialize: function(data){
        var that = this;
        this.type = data.type;
        this.cityname = data.cityname;
        this.lifename = data.lifename;
        this.collection = new LifeCollection(data);
        this.collection.cityname = data.cityname;
        this.collection.lifename = data.lifename;
        
        this.collection.on('all', function(){
            $('#life-list-current-page').html(that.collection.currentPage);
            $('#life-list-total').html(that.collection.total);
            $('#life-list-page-count').html(Math.floor(that.collection.total/that.collection.pageLimit) + 1);
        });
        
    },
    selectType: function(){
        var type = $('#life_type').val();
        self.location = '#lifes/1/'+type;
    },
    showLifeList: function(type,collection){
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function(model){
            model.set('type',type);
            var lifeListItemView = new LifeListItemView({model: model});
            lifeListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        });
    },
    showFirstPage: function(){
        var that = this;
        this.collection.getFirstPage(this.type,function(collection){
            that.showLifeList(that.type,collection);
        });
    },
    showPrevPage: function(){
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showRestaurantList(collection);
//        });
        if(!this.collection.hasPage(parseInt(this.collection.currentPage)-1))
            return;
        Backbone.history.navigate('lifes/'+(--this.collection.currentPage)+'/'+this.type, {trigger:true});
    },
    showNextPage: function(){
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showRestaurantList(collection);
//        });
        if(this.collection.hasPage(parseInt(this.collection.currentPage)+1) === false)
            return;
        Backbone.history.navigate('lifes/'+(++this.collection.currentPage)+'/'+this.type, {trigger:true});
    },
    showByPage: function(page,type){
        var that = this;
        this.collection.getPage(page,type, function(collection){
            that.showLifeList(type,collection);
        });
    },
    render: function(){
        var that = this;
        this.$el.html(that.template({
//            currentPage: that.collection.currentPage,
//            pageCount: (that.collection.total/that.collection.pageLimit) + 1,
//            total: that.collection.total
            type:this.type
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});

var LifeListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#life-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #life-list-item-edit' : 'editLife',
        'click #life-list-item-remove' : 'removeLife',
        'click #life-list-item-img' : 'manageimg'
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
   manageimg:function (e) {
        var manageImageView = new ManageImageView();
        manageImageView.model = this.model;
        manageImageView.render().$el.new_modal({
            "show":true,
            "z_index":weego.z_index++
        });
        manageImageView.unloadPic();
    },
    editLife : function(e){
        e.preventDefault();
        var type = $('#life_type').val();
        var item_id= $(e.currentTarget).attr('item_id');
        self.location = '/#life/'+item_id+'/'+type;
//        $('#app').off();
//        $('#app').empty();
//        (new RestaurantView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeLife : function(){
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});

var ManageImageView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"manageImageDialog",
        initialize:function () {
            _.bindAll(this, 'render');

        },
        render:function () {
            var _this = this;
            this.$el.css({
                width:"100%",
                height:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var template = Handlebars.compile($('#manageImageView').html());
            $(template()).appendTo(_this.$el);
            var type = _this.model.get('type');
            _this.$('#zxx_id').val(_this.model.get('_id'));
            _this.$('#_type').val(type);
            var imgForlder = 'restaurant';
            if(type=='1')
                imgForlder = 'restaurant';
            else if(type=='2')
                imgForlder = 'shopping';
            else
                imgForlder = 'entertainment';
            
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadImageView = new UploadImageView();
                    uploadImageView.model = {_id:image[i],imgForlder:imgForlder,type:type};
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('cover_image');
            if (coverImageName) {
                _this.$('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/'+imgForlder+'/origin/' + coverImageName + '?rev=' + Math.random() + '">'));
            }

            return this;
        },
        unloadPic:function () {
            this.initZXXFILE();
        },
        initZXXFILE : function(){
            var params = {
                fileInput: $("#fileImage").get(0),
                dragDrop: $("#fileDragArea").get(0),
                upButton: $("#fileSubmit").get(0),
                url: '/postLifeImage',
                filter: function(files) {
                    var arrFiles = [];
                    for (var i = 0, file; file = files[i]; i++) {
                        if (file.type.indexOf("image") == 0 || (!file.type && /\.(?:jpg|png|gif)$/.test(file.name) /* for IE10 */)) {
                            if (file.size >= 30720000) {
                                alert('您这张"'+ file.name +'"图片大小过大，应小于30M');    
                            } else {
                                arrFiles.push(file);    
                            }           
                        } else {
                            alert('文件"' + file.name + '"不是图片。');    
                        }
                    }
                    return arrFiles;
                },
                onSelect: function(files) {
                    var html = '', i = 0;
                    $("#preview").html('<div class="upload_loading"></div>');
                    var funAppendImage = function() {
                        file = files[i];
                        if (file) {
                            var reader = new FileReader()
                            reader.onload = function(e) {
                                html = html + '<div id="uploadList_'+ i +'" class="upload_append_list"><p><strong>' + file.name + '</strong>'+ 
                                    '<a href="javascript:" class="upload_delete" title="删除" data-index="'+ i +'">删除</a><br />' +
                                    '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" /></p>'+ 
                                    '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
                                '</div>';
                                
                                i++;
                                funAppendImage();
                            }
                            reader.readAsDataURL(file);
                        } else {
                            $("#preview").html(html);
                            if (html) {
                                //删除方法
                                $(".upload_delete").click(function() {
                                    ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                                    return false;   
                                });
                                //提交按钮显示
                                $("#fileSubmit").show();    
                            } else {
                                //提交按钮隐藏
                                $("#fileSubmit").hide();    
                            }
                        }
                    };
                    funAppendImage();       
                },
                onDelete: function(file) {
                    $("#uploadList_" + file.index).fadeOut();
                },
                onDragOver: function() {
                    $(this).addClass("upload_drag_hover");
                },
                onDragLeave: function() {
                    $(this).removeClass("upload_drag_hover");
                },
                onProgress: function(file, loaded, total) {
                    var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
                    eleProgress.show().html(percent);
                },
                onSuccess: function(file, response) {
                    $("#uploadInf").append("<p>图片"+file.name+"上传成功!</p>");
                },
                onFailure: function(file) {
                    $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");  
                    $("#uploadImage_" + file.index).css("opacity", 0.2);
                },
                onComplete: function() {
                    //提交按钮隐藏
                    $("#fileSubmit").hide();
                    //file控件value置空
                    $("#fileImage").val("");
                    $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
                }
            };
            ZXXFILE = $.extend(ZXXFILE, params);
            ZXXFILE.init();
        }
    });

var UploadImageView = Backbone.View.extend({
    tagName:'li',
    initialize:function () {
        _.bindAll(this, 'render', 'remove', 'setCoverImg');
    },
    render:function () {
        var _this = this;
        var template = Handlebars.compile($('#uploadImageView').html());
        $(template(_this.model)).appendTo(_this.$el);
        return this;
    },
    events:{
        'click .btn-remove':'remove',
        'click .setCoverImg':'setCoverImg'
    },
    setCoverImg:function () {
        var _this = this;
        var _id = $('#zxx_id').val();
        $.ajax({
            url:'/setCoverImgLife/' + _id + '/' + _this.model._id+'/'+_this.model.type,
            success:function (data) {
                if (data) {
                    $('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/'+_this.model.imgForlder+'/origin/' + data + '?rev=' + Math.random() + '">'));
                }
            }
        });
    },
    remove:function (e) {
        var _this = this;
        var _id = $('#zxx_id').val();
        $.ajax({
            url:'/delUploadImageLife/' + _id + '/' + _this.model._id+'/'+_this.model.type,
            success:function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

