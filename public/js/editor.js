/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego = {
    init:function () {
       
    }
};
$(weego.init());

(function (weego) {

    weego.GlobalRouter = Backbone.Router.extend({
        routes:{
            "city/:name/:pageno":"city_attractions", //
            "attractions/:pageno":"list_attractions",
            "attractions":"list_attractions",
            "lifes":"showLifeListView",
            "lifes/:pageno":"showLifeListView",
            "lifes/:pageno/:type":"showLifeListView",
            "lifes/:pageno/:type/:cityname":"showLifeListView",
            "lifes/:pageno/:type/:cityname/:lifename":"showLifeListView",
            "life/new":"showLifeDetailView",
            "life/:id/:type":"showLifeDetailView",

            "categorys":"showCategoryListView",
            "categorys/:pageno":"showCategoryListView",
            "categorys/:pageno/:type":"showCategoryListView",
            "category/new":"showCategoryDetailView",
            "category/:id":"showCategoryDetailView",

            "lifetags":"showLifetagListView",
            "lifetags/:pageno":"showLifetagListView",
            "lifetags/:pageno/:type":"showLifetagListView",
            "lifetag/new":"showLifetagDetailView",
            "lifetag/:id":"showLifetagDetailView",

            "areas":"showAreaListView",
            "areas/:pageno":"showAreaListView",
            "area/new":"showAreaDetailView",
            "area/:id":"showAreaDetailView",

            "lifetag":"showLifeTagListView",
            "lifetag/:pageno":"showLifeTagListView",
            "hotel/new":"showHotelDetailView",
            "hotel/:id":"showHotelDetailView",
            "hotels":"showHotelListView",
            "hotels/:page":"showHotelListView",
            "label":'list_label',

            "login":'login',
            'user/:pageno':"list_user",
            "logout":"logout",

            "city/:pageno":"city", //根据页码展示city
            "*actions":"list_city"//默认显示city

        },
        
        before:function (route) {
            $('#app').off();
           if ((!weego_user.loginFlag || !weego_user.globalUser) && route != 'login'&&route!='logout') {
            // if (false && route != 'login'&&route!='logout') {
                weego.globalCurrentUrl = window.location.hash;
                self.location = "#login";
                return false;
            } else if (route != 'login') {
                $('.show-nav').fadeIn();
            }
            if (weego_user.globalUser) {
                if (weego_user.globalUser.type == 1) {
                    $('#tab-user').fadeIn();
                }
            }
        },
        logout:function(){
            weego_user.loginFlag = false;
            weego_user.globalUser = null;
            $.cookie('user',null);
            $('.show-nav').fadeOut();
            self.location = "#login";
        },
        login:function () {
            new weego_user.LoginView().render();
        },
        list_user:function (pageno) {
            $('#tab-user').siblings().removeClass('active');
            $('#tab-user').addClass('active');
            weego_city.currentPage = pageno;
            weego_user.defaultView = new weego_user.AppView();
            weego_user.defaultView.getData(weego_user.currentPage);
        },
        list_label:function () {
            $('#tab-label').siblings().removeClass('active');
            $('#tab-label').addClass('active');
            weego_label.defaultView = new weego_label.AppView();
            weego_label.defaultView.getData(weego_label.currentPage);
        },
        city:function (pageno) {
            $('#tab-city').siblings().removeClass('active');
            $('#tab-city').addClass('active');
            weego_city.currentPage = pageno;
            weego_city.defaultView = new weego_city.AppView();
            weego_city.defaultView.getData(weego_city.currentPage)
        },
        list_city:function () {
            $('#tab-city').siblings().removeClass('active');
            $('#tab-city').addClass('active');
            weego_city.currentPage = 1;
            weego_city.defaultView = new weego_city.AppView();
            weego_city.defaultView.getData(weego_city.currentPage)
        },
        city_attractions:function (name, pageno) {
            $('#tab-attractions').siblings().removeClass('active');
            $('#tab-attractions').addClass('active');
            weego.name = name
            weego.currentPage = pageno;
            weego.defaultView = new weego.AppView();
            weego.defaultView.getData(weego.currentPage, weego.name)
        },
        list_attractions:function (pageno) {
            $('#tab-attractions').siblings().removeClass('active');
            $('#tab-attractions').addClass('active');
            weego.name = '';
            weego.currentPage = (pageno == null ? 1 : pageno);
            weego.defaultView = new weego.AppView();
            weego.defaultView.getData(weego.currentPage, weego.name)
        },
        showHotelDetailView: function(id){
            $('#app').off();
            $('#app').empty();

            if(id == null)
                (new HotelView({model: new HotelModel()})).render().$el.appendTo($('#app'));
            else{
                var hotelModel = new HotelModel();
                hotelModel.set('_id', id);
                hotelModel.fetch({success: function(){
                     var hotelView = new HotelView({model: hotelModel});
                     hotelView.render().$el.appendTo($('#app'));
                     hotelView.initMarkDown();  //初始化markdown
                }});
            }
        },
        showHotelListView: function(page){
            $('#app').off();
            $('#app').empty();
            if(page == null){
                var hotelListView = new HotelListView();
                hotelListView.render().showFirstPage();
                hotelListView.$el.appendTo($('#app'));
            }
            if(page != null){
                var hotelListView = new HotelListView();
                hotelListView.render();
                hotelListView.showByPage(page);
                hotelListView.$el.appendTo($('#app'));
            }
            $('#tab-hotels')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showLifeListView: function(page,type,cityname,lifename){
            $('#app').off();
            $('#app').empty();
            if(type == null)
                type = '1';
            var model = {};
            model.type = type;
            if(cityname){
                var a=cityname.split('_');
                if(a[1]){
                    model.cityname = a[1];
                }
            }
            if(lifename){
                var a=lifename.split('_');
                if(a[1]){
                    model.lifename = a[1];
                }
            }
            if(page == null){
                var lifeListView = new LifeListView(model);
                lifeListView.render().showFirstPage();
                lifeListView.$el.appendTo($('#app'));
            }else{
                var lifeListView = new LifeListView(model);
                lifeListView.render();
                lifeListView.showByPage(page);
                lifeListView.$el.appendTo($('#app'));
            }

            $('#tab-life')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showLifeDetailView: function(id,type){
            $('#app').off();
            $('#app').empty();
            if(type == null)
                type = '1';
            if(id == null){
                var lifeListView  = null;
                if(type=='1')
                    lifeListView = new LifeView({model: new RestaurantModel()});
                else if(type=='2')
                    lifeListView = new LifeView({model: new ShoppingModel()});
                else
                    lifeListView = new LifeView({model: new EntertainmentModel()});
                lifeListView.render().$el.appendTo($('#app'));
            }
            else{
                if(type == '1'){
                    var restaurantModel = new RestaurantModel();
                    restaurantModel.set('_id', id);
                    restaurantModel.fetch({success: function(){
                        restaurantModel.set('type','1');
                         var restaurantView = new LifeView({model: restaurantModel});
                         restaurantView.render().$el.appendTo($('#app'));
                    }});
                }else if(type == '2'){
                    var shoppingModel = new ShoppingModel();
                    shoppingModel.set('_id', id);
                    shoppingModel.fetch({success: function(){
                        shoppingModel.set('type','2');
                         var shoppingView = new LifeView({model: shoppingModel});
                         shoppingView.render().$el.appendTo($('#app'));
                    }});
                }else{
                    var entertainmentModel = new EntertainmentModel();
                    entertainmentModel.set('_id', id);
                    entertainmentModel.fetch({success: function(){
                        entertainmentModel.set('type','3');
                         var entertainmentView = new LifeView({model: entertainmentModel});
                         entertainmentView.render().$el.appendTo($('#app'));
                    }});
                }
            }
        },
        showCategoryListView: function(page,type){
            $('#app').off();
            $('#app').empty();
            if(type == null)
                type = '1';
            if(page == null){
                var categoryListView = new CategoryListView({type:type});
                categoryListView.render().showFirstPage();
                categoryListView.$el.appendTo($('#app'));
            }else{
                var categoryListView = new CategoryListView({type:type});
                categoryListView.render();
                categoryListView.showByPage(page,type);
                categoryListView.$el.appendTo($('#app'));
            }
            $('#tab-category')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showCategoryDetailView: function(id){
            $('#app').off();
            $('#app').empty();
            if(id == null){
                var categoryView = new CategoryView({model: new CategoryModel()});
                categoryView.render().$el.appendTo($('#app'));
            }
            else{
                var categoryModel = new CategoryModel();
                categoryModel.set('_id', id);
                categoryModel.fetch({success: function(){
                     var categoryView = new CategoryView({model: categoryModel});
                     categoryView.render().$el.appendTo($('#app'));
                }});
            }
        },
        showLifetagListView: function(page,type){
            $('#app').off();
            $('#app').empty();
            if(type == null)
                type = '1';
            if(page == null){
                var lifetagListView = new LifetagListView({type:type});
                lifetagListView.render().showFirstPage();
                lifetagListView.$el.appendTo($('#app'));
            }else{
                var lifetagListView = new LifetagListView({type:type});
                lifetagListView.render();
                lifetagListView.showByPage(page,type);
                lifetagListView.$el.appendTo($('#app'));
            }
            $('#tab-lifetag')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showLifetagDetailView: function(id){
            $('#app').off();
            $('#app').empty();
            if(id == null){
                var lifetagView = new LifetagView({model: new LifetagModel()});
                lifetagView.render().$el.appendTo($('#app'));
            }
            else{
                var lifetagModel = new LifetagModel();
                lifetagModel.set('_id', id);
                lifetagModel.fetch({success: function(){
                     var lifetagView = new LifetagView({model: lifetagModel});
                     lifetagView.render().$el.appendTo($('#app'));
                }});
            }
        },
        showAreaListView: function(page){
            $('#app').off();
            $('#app').empty();
            if(page == null){
                var areaListView = new AreaListView();
                areaListView.render().showFirstPage();
                areaListView.$el.appendTo($('#app'));
            }else{
                var areaListView = new AreaListView();
                areaListView.render();
                areaListView.showByPage(page);
                areaListView.$el.appendTo($('#app'));
            }
            $('#tab-area')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showAreaDetailView: function(id){
            $('#app').off();
            $('#app').empty();
            if(id == null){
                var areaView = new AreaView({model: new AreaModel()});
                areaView.render().$el.appendTo($('#app'));
            }
            else{
                var areaModel = new AreaModel();
                areaModel.set('_id', id);
                areaModel.fetch({success: function(){
                     var areaView = new AreaView({model: areaModel});
                     areaView.render().$el.appendTo($('#app'));
                }});
            }
        },

    });
    weego.currentPage = 1;
    weego.sumpages = 1;
    weego.limit = 10;
    weego.z_index = 2000;
    weego.count = 0;
    weego.name;
    weego.globalCurrentUrl = '';
    weego.AttractionsModel = Backbone.Model.extend({
        urlRoot:'/attractions',
        idAttribute:"_id"
    });
    weego.AttractionsColletion = Backbone.Collection.extend({
//        url:'/getAllAttractions',
        model:weego.AttractionsModel
    });

    weego.LabelModel = Backbone.Model.extend({
        urlRoot:'/addlabel'
    });

    weego.CityModel = Backbone.Model.extend({
        urlRoot:''
    });
    weego.CityCollection = Backbone.Collection.extend({
        model:weego.CityModel
    });

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifBig', function (v1, v2, options) {
        if (v1 > v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifHas', function(collection, value, options){
        var exist = false;
        _.each(collection, function(v){
            if(v == value)
                exist = true;
        });
        if(exist)
            return options.fn(this);
        return options.inverse(this);
    });
   
   //------------------------#load------------------------------------------------------------------ 
    
    $("#hotelDetailView").load("templ/hotel_detail.html",function(){
       console.log('load hotelDetailView over!');
    });
    $("#attractions_template").load("templ/attraction.html",function(){
        console.log('load attractions_template over!');
    });

    $("#attractions_detail_template").load("templ/attraction_editor.html",function(){
       console.log('load attractions_detail_template over!');
    });
    $("#add_city_template").load("templ/city.html",function(){
       console.log('load add_city_template over!');
    });
    $("#city_edit_template").load("templ/city_editor.html",function(){
       console.log('load city_edit_template over!');
    });
    $("#add_label_template").load("templ/label.html",function(){
       console.log('load add_label_template over!');
    });
    $("#label_edit_template").load("templ/label_editor.html",function(){
       console.log('load label_edit_template over!');
    });
    $("#add_user_template").load("templ/user.html",function(){
       console.log('load add_user_template over!');
    });
    $("#edit_user_template").load("templ/user_editor.html",function(){
       console.log('load edit_user_template over!');
    });
    $("#categoryDetailView").load("templ/category_detail.html",function(){
       console.log('load categoryDetailView over!');
    });
    $("#lifetagDetailView").load("templ/lifetag_detail.html",function(){
       console.log('load lifetagDetailView over!');
    });
    $("#lifeDetailView").load("templ/life_detail.html",function(){
       console.log('load lifeDetailView over!');
    });
    $("#areaDetailView").load("templ/area_detail.html",function(){
       console.log('load areaDetailView over!');
    });
     

 //----------------------------------------------------------------------------------------------   
    //add city view
    weego.AttractionsDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function (that) {
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            this.that = that;
            var _this = this;
            var template = Handlebars.compile($("#attractions_template").html());
            $(template(_this.model)).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
//            'change #attractions_en':'showLocations',
//            'change .labels':'savelabel',
            'click #addlabel':'addlabel',
            'click .del':'dellabel',
            'focus .labels':'autoget',
            'focus #masterLabel':'autogetMasterLabel'
        },
        autogetMasterLabel:function (e) {
            var _this = this;
            $("#masterLabel").autocomplete({
                source:function (request, response) {
                    $.ajax({
                        url:"/getLabelByLevel/1",
                        dataType:"json",
                        data:request,
                        success:function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label:item.label,
                                            value:item.label,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select:function (event, ui) {
                    $("#masterLabel").attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        autoget:function (e) {
            var _this = this;
            $(".labels").autocomplete({
                source:function (request, response) {
                    $.ajax({
                        url:"/getLabelByLabelID/" + $("#masterLabel").attr('data-value'),
                        dataType:"json",
                        success:function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label:item.label,
                                            value:item.label,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select:function (event, ui) {
                    $(e.target).attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" datatype="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
//        savelabel:function (e) {
//            console.log($(e.target).val());
//            var _this = this;
//            var newlabel = new weego.LabelModel({label:$(e.target).val()});
//            newlabel.save(null, {
//                success:function (model, res) {
//                    if (!res.isSuccess) {
//                        console.log("cuole");
//                    } else {
//                        console.log(model._id);
//                    }
//                }
//            });
//        },
        showCityLocations:function () {
            locationCity();
        },
        showLocations:function () {
            codeAddress();
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            var newAttractions = new weego.AttractionsModel({cityname:$("#cityname").val(), attractions_en:$("#attractions_en").val(),
                address:$('#address').val(), price:$('#price').val(), opentime:$('#opentime').val(), traffic_info:$('#traffic_info').val(),
				dayornight:$('input:radio[name="dayornight"]:checked').val(),website:$("#website").val(), telno:$("#telno").val(),
                attractions:$("#attractions").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(),
                recommand_duration:$('#recommand_duration').val(),recommand_flag:$('input:radio[name="recommand_flag"]:checked').val(), show_flag:$('input:radio[name="show_flag"]:checked').val(),
                masterLabel:$("#masterLabel").attr('data-value'), subLabel:array_label, latitude:$("#latitude").val(), longitude:$("#longitude").val()});
            newAttractions.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert('保存失败');
                        $("#attractionsDialog").new_modal('hide');
                        weego.defaultView.getData(weego.currentPage, model.get('cityname'));
                    } else {
                        alert('保存成功');
                        $("#attractionsDialog").new_modal('hide');
                        weego.defaultView.getData(weego.currentPage, model.get('cityname'));
                    }
                },
                error:function () {
                    alert('保存失败');
                    $("#attractionsDialog").new_modal('hide');
                    weego.defaultView.getData(weego.currentPage, model.get('cityname'));
                }
            });
            return false;
        }
    });

    //edit city view
    weego.ShowAttractionsDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDetailDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function () {
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#attractions_detail_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
//            'change #attractions_en':'showLocations',
            'click #addlabel':'addlabel',
            'click .del':'dellabel',
//            'change .labels':'savelabel',
            'focus .labels':'autoget',
            'focus #masterLabel':'autogetMasterLabel',
            'click #cancel':'cancel'
        },
        autogetMasterLabel:function (e) {
            var _this = this;
            $("#masterLabel").autocomplete({
                source:function (request, response) {
                    $.ajax({
                        url:"/getLabelByLevel/1",
                        dataType:"json",
                        data:request,
                        success:function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label:item.label,
                                            value:item.label,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select:function (event, ui) {
                    $("#masterLabel").attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        autoget:function (e) {
            var _this = this;
            $(".labels").autocomplete({
                source:function (request, response) {
                    $.ajax({
                        url:"/getLabelByLabelID/" + $("#masterLabel").attr('data-value'),
                        dataType:"json",
                        success:function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label:item.label,
                                            value:item.label,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select:function (event, ui) {
                    $(e.target).attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        savelabel:function (e) {
            console.log($(e.target).val());
            var _this = this;
            if ($(e.target).val() == '' || $(e.target).val() == null) {
                return false;
            } else {
                var newlabel = new weego.LabelModel({label:$(e.target).val()});
                newlabel.save(null, {
                    success:function (model, res) {
                        if (!res.isSuccess) {
                            console.log("cuole");
                        } else {
                            console.log(model.get('_id'));
                        }
                    }
                });
            }
        },
        showCityLocations:function () {
            locationCity();
        },
        showLocations:function () {
            codeAddress();
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            _this.model.save({cityname:$("#cityname").val(), attractions_en:$("#attractions_en").val(), attractions:$("#attractions").val(), address:$('#address').val(), price:$('#price').val(), opentime:$('#opentime').val(),
                traffic_info:$('#traffic_info').val(),dayornight:$('input:radio[name="dayornight"]:checked').val(),
                website:$("#website").val(), telno:$("#telno").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(), recommand_flag:$('input:radio[name="recommand_flag"]:checked').val(),
                recommand_duration:$('#recommand_duration').val(),show_flag:$('input:radio[name="show_flag"]:checked').val(), masterLabel:$("#masterLabel").attr('data-value'), subLabel:array_label,
                latitude:$("#latitude").val(), longitude:$("#longitude").val()}, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        alert('保存成功');
                        $("#attractionsDetailDialog").new_modal('hide');
                        weego.defaultView.getData(weego.currentPage, model.get('cityname'));
                    }
                },
                error:function () {
                    console.log("tianjiashibai");
                }
            });
            return false;
        },
        cancel:function () {
            $("#attractionsDetailDialog").new_modal('hide');
        }
    });

    weego.AttractionsView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    var template = Handlebars.compile($("#attractionsView").html());
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete',
            'click .upload':'upload',
            'click #manageimg':'manageimg'
        },
        manageimg:function (e) {
            var manageImageView = new weego.ManageImageView();
            manageImageView.model = this.model;
            manageImageView.render().$el.new_modal({
                "show":true,
                "z_index":weego.z_index++
            });
            manageImageView.unloadPic();
        },
        modify:function (e) {
            var showAttractionsDetailView = new weego.ShowAttractionsDetailView();
            showAttractionsDetailView.model = this.model;
            showAttractionsDetailView.render().$el.new_modal({
                "show":true,
                "z_index":weego.z_index++
            });
            initialize();
        },
        delete:function (e) {
            var _this = this;
            var isConfirmed = confirm("是否删除???");
            if (isConfirmed) {
                this.model.destroy({
                    success:function (model, response) {
                        _this.$el.remove();
                    }
                });
            }
        },
        upload:function () {
            var _this = this;
            $('#dialog').dialog();
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'upload',
                debug:true,
                params:{
                    attractions_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        }
    });
    weego.ManageImageView = Backbone.View.extend({
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
            _this.$('#zxx_id').val(_this.model.get('_id'));
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadImageView = new weego.UploadImageView();
                    uploadImageView.model = {_id:image[i],imgForlder:'attractions'};
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('coverImageName');
            if (coverImageName) {
                _this.$('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/attractions/origin/' + coverImageName + '?rev=' + Math.random() + '">'));
            }

            return this;
        },
        unloadPic:function () {
            this.initZXXFILE();
            // var _this = this;
            // var oBtn = document.getElementById("unloadPic");
            // var oShow = document.getElementById("uploadedName");
            // new AjaxUpload(oBtn, {
            //     action:"/postimage",
            //     name:"upload",
            //     data:{
            //         _id:_this.$('#zxx_id').val()
            //     },
            //     responseType:"json",
            //     onSubmit:function (file, ext) {
            //     },
            //     onComplete:function (file, response) {
            //         var uploadImageView = new weego.UploadImageView();
            //         uploadImageView.model = response;
            //         uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
            //     }
            // });
        },
        initZXXFILE : function(){
            var params = {
                fileInput: $("#fileImage").get(0),
                dragDrop: $("#fileDragArea").get(0),
                upButton: $("#fileSubmit").get(0),
                url: $("#uploadForm").attr("action"),
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
    weego.UploadImageView = Backbone.View.extend({
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
                url:'/setCoverImg/' + _id + '/' + _this.model._id,
                success:function (data) {
                    if (data) {
                        $('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/attractions/origin/' + data + '?rev=' + Math.random() + '">'));
                    }
                }
            });
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#zxx_id').val();
            $.ajax({
                url:'/delUploadImage/' + _id + '/' + _this.model._id,
                success:function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    weego.AppView = Backbone.View.extend({
        el:'#app',
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendAttractions', 'addAttractions', 'getData');
            this.collection = new weego.AttractionsColletion();
            this.collection.on('add', this.appendAttractions);
        },
        render:function () {
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#appView").html());
            $(template()).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addAttractionsButton':'addAttractions',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },
        addAttractions:function () {
            new weego.AttractionsDetailView().render(this).$el.new_modal({
                "show":true,
                "z_index":weego.z_index++
            });
            initialize();
        },
        appendAttractions:function (attractions) {
            var attractionsView = new weego.AttractionsView();
            attractionsView.model = attractions;
            attractionsView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if (weego.currentPage >= weego.sumpages) {
                alert("没有下一页");
                return;
            }
            weego.currentPage = parseInt(weego.currentPage) + 1;
            if (weego.name != '') {
                self.location = "#city/" + weego.name + "/" + weego.currentPage;
            } else {
                self.location = "#attractions/" + weego.currentPage;
            }

        },
        prePage:function () {
            if (weego.currentPage > 1) {
                weego.currentPage = parseInt(weego.currentPage) - 1;
                if (weego.name != '') {
                    self.location = "#city/" + weego.name + "/" + weego.currentPage;
                } else {
                    self.location = "#attractions/" + weego.currentPage;
                }
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index, name) {
            var _this = this;
            var cityname = name || "";
            $.ajax({
                url:'/getAttractionsByPage/' + weego.limit + '/' + _index + '/' + cityname,
                type:'GET',
                success:function (data) {
                    weego.count = data.count;
                    if (data && data.attractions && data.attractions.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        _this.$('#allattractionsno').html(weego.count);
                        _this.$('#current_page').html(weego.currentPage);
                        weego.sumpages = Math.ceil(weego.count / weego.limit);
                        _this.$('#sum_page').html(weego.sumpages);
                        for (var i = 0; i < data.attractions.length; i++) {
                            _this.collection.add(data.attractions[i]);
                        }
                    } else {
                        if (weego.currentPage == 1) {
                            _this.render();
                            _this.$('#allattractionsno').html('0');
                            _this.$('#current_page').html('1');
                            _this.$('#sum_page').html('1');
                            alert("没有景点");
                        } else {
                            alert("无下一页");
                            weego.currentPage--;
                        }
                    }
                }
            });
        }
    });
    var geocoder;
    var map;
    var city_location;
    var marker;

    function initialize() {
        geocoder = new google.maps.Geocoder();
        var latlng;
        if ($("#latitude").val() != '' && $("#longitude").val() != '') {
            latlng = new google.maps.LatLng(parseFloat($("#latitude").val()), parseFloat($("#longitude").val()));
        } else {
            latlng = new google.maps.LatLng(39.924482, 116.408386);
        }

        var mapOptions = {
            zoom:9,
            center:latlng,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        marker = new google.maps.Marker({
            position:latlng,
            map:map
        });
    }

    function locationCity() {
        var address = document.getElementById('cityname').value;
        geocoder.geocode({ 'address':address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                city_location = results[0].geometry.location;
                map.setCenter(results[0].geometry.location);
            }
        });
    }


    function codeAddress() {
        marker.setMap(null);
        var address = document.getElementById('attractions_en').value;
        geocoder.geocode({ 'address':address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $("#latitude").val(results[0].geometry.location.lat());
                $("#longitude").val(results[0].geometry.location.lat());
                map.setCenter(results[0].geometry.location);
                marker = new google.maps.Marker({
                    map:map,
                    position:results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

}(weego));