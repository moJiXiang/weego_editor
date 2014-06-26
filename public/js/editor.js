/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego = {
    init:function () {
        $(".cmsNav").on("click","a",function(evt){
            $(evt.currentTarget).addClass("active").siblings("a").removeClass("active");
        });                   
       
    }
};
var weegoCache = {

};
$(weego.init());

(function (weego) {

    weego.GlobalRouter = Backbone.Router.extend({
        routes:{
            // "country":"city_attractions", //
            "allCountries":"showallCountries",
            "allCountries/:countryname":"showCountry",
            "allCountries/:countryname/:cityname":"showCity",
            "city/:pageno":"city", //根据页码展示city
            "city/:pageno/:country/:cityname":"city", //根据页码展示city

            "attractions/:pageno":"list_attractions",
            "attractions":"list_attractions",
            "attraction/new":"showAttractionView",
            "attraction/:attractionId":"showAttractionView",
            "attractions/:pageno/:cityname/:attname":"list_attractions",

            "lifes":"showLifeListView1",
            "lifes/:pageno":"showLifeListView1",
            "lifes/:pageno/:type":"showLifeListView1",
            "lifes/:pageno/:type/:cityname":"showLifeListView1",
            "lifes/:pageno/:type/:cityname/:lifename":"showLifeListView1",
            "lifes/:pageno/:type/:cityname/:areaname":"showLifeListView2",
            "lifes/:pageno/:type/:cityname/:lifename/:tags":"showLifeListView",
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
            "hotels/:page/:cityname/:hotelname":"showHotelListView",

            "label":'list_label',
            "login":'login',
            'user/:pageno':"list_user",
            "logout":"logout",
            
            //"*actions":"list_city"//默认显示city
            "main":"userMain",
            "statistics":"dataStatistic",
            "*actions":"userMain"

        },
        dataStatistic:function(){
            new weego.StatisticsView();
        },
        userMain:function(evt){
            var currentUser=weego_user.globalUser;
            $('.cmsNav').css('display','');
            if(currentUser.type==0){
                new weego_user.EditorMainView();
                $('.cmsNav .admin').remove();
            }else if(currentUser.type==1){
                new weego_user.AdminMainView();
            }else if(currentUser.type==-1){
                new weego_user.GuestMainView();
                $('.cmsNav .admin').remove();
            }
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
                // console.log(weego_user.globalUser);
                if (weego_user.globalUser.type == 1) {
                    $('#tab-user').fadeIn();
                    $('.icomoon_user').css('display','');
                    $('.icomoon_labels').css('display','');
                    $('.icomoon_user').css('display','');
                    $('.icomoon_label').css('display','');
                    $('.icomoon_category').css('display','');
                    $('.icomoon_lifetag').css('display','');
                }else{
                     $('.icomoon_user').css('display','none');
                    $('.icomoon_labels').css('display','none');
                    $('.icomoon_user').css('display','none');
                    $('.icomoon_label').css('display','none');
                    $('.icomoon_category').css('display','none');
                    $('.icomoon_lifetag').css('display','none');
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
            $('.cmsNav').css('display','none');
            new weego_user.LoginView().render();
        },
        list_user:function (pageno) {
            if(weego_user.globalUser.type==1){
                $('#tab-user').siblings().removeClass('active');
                $('#tab-user').addClass('active');
                weego_city.currentPage = pageno;
                weego_user.defaultView = new weego_user.AppView();
                weego_user.defaultView.getData(weego_user.currentPage);
            }else{
                alert('权限不足！');
                self.location = '#main';
            }
        },
        list_label:function () {
            $('#tab-label').siblings().removeClass('active');
            $('#tab-label').addClass('active');
            weego_label.defaultView = new weego_label.AppView();
            weego_label.defaultView.getData(weego_label.currentPage);
        },
        showallCountries:function(){   
            $.ajax({
                url:'/getAllCity',
                method:'get',
                success:function(data){
                    var allCountries = new weego.AllCountriesView();
                    $('#app').html('').append(allCountries.render(data).$el);
                }
            })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        },
        showCountry:function(countryname){
            var countrycities = new weego.CountryCitiesView();
            $('#app').html('').append(countrycities.render(countryname).$el);
            var AjaxDataSource = function (options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
            };

            AjaxDataSource.prototype = {

                /**
                 * Returns stored column metadata
                 */
                columns: function() {
                    return this._columns;
                },
                /**
                 * Called when Datagrid needs data. Logic should check the options parameter
                 * to determine what data to return, then return data by calling the callback.
                 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
                 * @param {function} callback To be called with the requested data.
                 */
                data: function(options, callback) {
                    var url = '/getCountryCities/'+countryname;
                    var self = this;

                    if (options.search || true) {
                        // Search active.  Add URL parameters for API.
                        url += '?';
                        url += options.search ? ('&cityname=' + encodeURIComponent(options.search)) : '';
                        // url += '?cityname=' + encodeURIComponent(options.search);
                        url += '&perpage=' + options.pageSize;
                        url += '&page=' + (options.pageIndex + 1);
                        if (options.sortProperty) {
                            url += "&sort=" + options.sortProperty + "&sortdir=" + options.sortDirection
                        }

                        //alert(url); //use this to debug
                        $.ajax(url, {

                            // Set JSONP options for API
                            dataType: 'json',
                            type: 'GET'

                        }).done(function(response) {
                            // alert('ajax');
                            
                            console.log(response);
                            //alert(response.data);

                            // Prepare data to return to Datagrid
                            var data = response.results;
                            var count = response.results.length;
                            var startIndex = options.pageIndex * options.pageSize;
                            var endIndex = startIndex + options.pageSize;
                            var end = (endIndex > count) ? count : endIndex;
                            var pages = Math.ceil(count / options.pageSize);
                            var page = options.pageIndex + 1;
                            var start = startIndex + 1;

                            // SORTING is dealt with by the server
                            data = data.slice(startIndex, endIndex);
                            // Allow client code to format the data
                            if (self._formatter) self._formatter(data);

                            // Return data to Datagrid
                            callback({
                                data: data,
                                start: start,
                                end: end,
                                count: count,
                                pages: pages,
                                page: page
                            });

                        });
                    } else {
                        // No search. Return zero results to Datagrid
                        callback({
                            data: [],
                            start: 0,
                            end: 0,
                            count: 0,
                            pages: 0,
                            page: 0
                        });
                    }
                }
            };
            $('#CityGrid').datagrid({
                stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                dataSource: new AjaxDataSource({
                    // Column definitions for Datagrid
                    columns: [{
                        property: 'cityname',
                        label: '城市名',
                        sortable: false
                    }, {
                        property: 'show_flag',
                        label: '是否显示',
                        sortable: true
                    }, {
                        property: 'recommand_day',
                        label: '是否推荐',
                        sortable: true
                    }, {
                        property: 'recommand_day',
                        label: '审核通过',
                        sortable: true
                    }, {
                        property: 'recommand_day',
                        label: '审核时间',
                        sortable: true
                    }, {
                        property: 'recommand_day',
                        label: '编辑时间',
                        sortable: true
                    }],

                    formatter: function(items) {
                        $.each(items, function(index, item) {
                            item.cityname = '<a href="#allCountries/'+ item.countryname +'/'+item.cityname+'">' + item.cityname +'</a>';
                            item.show_flag = '<button type="button" class="btn">' + item.show_flag + '</button>';
                        });
                    }
                })

            });
            
        },
        showCity:function(countryname, cityname) {
            $.ajax({
                url:'/getCountryCities/'+countryname+'/'+cityname,
                method:'GET',
                success:function(data){
                    console.log(data);
                    var result = data.results;
                    var cityview = new weego.CityPreView();
                    $('#app').html('').append(cityview.render(data).$el);
                    $( "#datepicker" ).datepicker();
                }
            })

        },
        city:function (pageno,country,cityname) {
            $('#tab-city').siblings().removeClass('active');
            $('#tab-city').addClass('active');
            var query = {};
            if(country){
                var a=country.split('_');
                if(a[1]){
                    query.country = a[1];
                }
            }
            if(cityname){
                var a=cityname.split('_');
                if(a[1]){
                    query.cityname = a[1];
                }
            }
            weego_city.currentPage = pageno;
            weego_city.defaultView = new weego_city.AppView();
            weego_city.defaultView.getData(weego_city.currentPage,query);
        },
        list_city:function () {
            $('#tab-city').siblings().removeClass('active');
            $('#tab-city').addClass('active');
            weego_city.currentPage = 1;
            weego_city.defaultView = new weego_city.AppView();
            weego_city.defaultView.getData(weego_city.currentPage)
        },
        // city_attractions:function (name, pageno) {
        //     $('#tab-attractions').siblings().removeClass('active');
        //     $('#tab-attractions').addClass('active');
        //     weego.name = name;
        //     weego.currentPage = pageno;
        //     weego.defaultView = new weego.AppView();
        //     weego.defaultView.getData(weego.currentPage, weego.name);
        // },
        list_attractions:function (pageno,cityname,attrname) {
            $('#tab-attractions').siblings().removeClass('active');
            $('#tab-attractions').addClass('active');
            var query = {};
            if(cityname){
                var a=cityname.split('_');
                if(a[1]){
                    query.cityname = a[1];
                }
            }
            if(attrname){
                var a=attrname.split('_');
                if(a[1]){
                    query.attrname = a[1];
                }
            }
            // weego.name = '';
            weego.currentPage = (pageno == null ? 1 : pageno);
            weego.defaultView = new weego.AppView({cityname:cityname});
            weego.defaultView.getData(weego.currentPage,query);
        },
        showAttractionView: function(id){
            $('#app').off();
            $('#app').empty();

            if(id == null){
                new weego.AttractionsDetailView().render(this).$el.appendTo($('#app'));
                initialize();
            }
            else{
                var attractionModel = new weego.AttractionsModel();
                attractionModel.set('_id', id);
                attractionModel.fetch({success: function(){
                    console.log(attractionModel)
                     var showAttractionsDetailView = new weego.ShowAttractionsDetailView();
                     showAttractionsDetailView.model =  attractionModel;
                     showAttractionsDetailView.render().$el.appendTo($('#app'));
                     initialize();
                }});
            }
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
        showHotelListView: function(page,cityname,hotelname){
            $('#app').off();
            $('#app').empty();
            if(page == null){
                var query = {};
                var hotelListView = new HotelListView(query);
                hotelListView.render().showFirstPage();
                hotelListView.$el.appendTo($('#app'));
            }
            if(page != null){
                var query = {};
                if(cityname){
                    var a=cityname.split('_');
                    if(a[1]){
                        query.cityname = a[1];
                    }
                }
                if(hotelname){
                    var a=hotelname.split('_');
                    if(a[1]){
                        query.hotelname = a[1];
                    }
                }
                var hotelListView = new HotelListView(query);
                hotelListView.render();
                hotelListView.showByPage(page);
                hotelListView.$el.appendTo($('#app'));
            }
            $('#tab-hotels')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showLifeListView2 : function(page,type,cityname,areaname){
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
            if(areaname){
                var a=areaname.split('_');
                if(a[1]){
                    model.areaname = a[1];
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

            $('.back_cur_city').prop("href","/index.html#city/1/q_/"+cityname);
        },
        showLifeListView1: function(page,type,cityname,lifename){
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

            $('.back_cur_city').prop("href","/index.html#city/1/q_/"+cityname);
        },
        showLifeListView: function(page,type,cityname,lifename,tags){
            $('#app').off();
            $('#app').empty();
            if(type == null)
                type = '1';
            var model = {};
            model.tags = "";
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
            if(tags){
                model.tags = tags;
                // model.tags =  tags.split("=");
                // model.tags = model.tags[1].split(",");
            }
            // if(isLocalFlag){
            //     var a=isLocalFlag.split('=');
            //     if(a[1]){
            //         model.isLocalFlag = a[1];
            //     }
            // }
            // if(isMichilinFlag){
            //     var a=isMichilinFlag.split('=');
            //     if(a[1]){
            //         model.isMichilinFlag = a[1];
            //     }
            // }
            // if(isBestDinnerchoics){
            //     var a=isBestDinnerchoics.split('=');
            //     if(a[1]){
            //         model.isBestDinnerchoics = a[1];
            //     }
            // }
            // if(isMostPopular){
            //     var a=isMostPopular.split('=');
            //     if(a[1]){
            //         model.isMostPopular = a[1];
            //     }
            // }
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

            $('.back_cur_city').prop("href","/index.html#city/1/q_/"+cityname);
        },
        showLifeDetailView: function(id,type){
            $('#app').off();
            $('#app').empty();
            if(type == null)
                type = '1';
            console.log(id);
            if(id == null){
                var lifeListView  = null;
                if(type=='1')
                {
                    lifeListView = new LifeView({model: new RestaurantModel()});
                }
                else if(type=='2'){
                    lifeListView = new LifeView({model: new ShoppingModel()});
                }
                else{
                     lifeListView = new LifeView({model: new EntertainmentModel()});
                }
                lifeListView.render().$el.appendTo($('#app'));
            }
            else{
                if(type == '1'){
                    var restaurantModel = new RestaurantModel();
                    restaurantModel.set('_id', id);
                    restaurantModel.fetch({success: function(){
                        console.log(restaurantModel);
                        restaurantModel.set('type', '1');
                        var restaurantView = new LifeView({
                            model: restaurantModel
                        });
                        restaurantView.render().$el.appendTo($('#app'));
                    }});
                    // $.ajax({
                    //     url: '/restaurant/'+ id ,
                    //     success: function(data){
                    //         console.log(data);
                    //         // $('#lifeDetailView').html(data.toJSON());
                    //         // var template = Handlebars.compile($('#lifeDetailView').html());
                    //         // console.log(template);
                    //         // $('#app').append(template(data[0]));
                    //         // console.log(template(data[0]));
                    //         var restaurantModel = new RestaurantModel();
                    //         restaurantModel.set({
                    //             '_id', id

                    //         });
                    //         var restaurantView = new LifeView({
                    //             model: restaurantModel
                    //         });
                    //         restaurantView.render().$el.appendTo($('#app'));
                    //     }
                    // })
                }else if(type == '2'){
                    var shoppingModel = new ShoppingModel();
                    shoppingModel.set('_id', id);
                    shoppingModel.fetch({success: function(a){
                        console.log(shoppingModel);
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

    weego.AuditingModel = Backbone.Model.extend({
        urlRoot:'/auditing',
        idAttribute:"_id"
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
    Handlebars.registerHelper('ifHas', function(v1, v2, options) {
        if (v1.indexOf(v2) >= 0) {
            return options.fn(this);
        }
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
        //className:"modal hide fade",
        //"id":"attractionsDialog",
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
            _this.model = new weego.AttractionsModel();
            if(weego_user.globalUser.type == 1){
                _this.model.set('_show_flag',true);
            }else{
                _this.model.set('_show_flag',false);
            }
            var template = Handlebars.compile($("#attractions_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            _this.initSelect();
            return this;
        },
        initSelect: function(){
            $.ajax({
                url:"/getMyToDoTasks",
                success:function (data) {
                    if(data.status){
                        var results = data.results;
                        console.log(results);
                        var option = '';
                        for(var i=0;i<results.length;i++){
                            var one = results[i];
                            option +='<option value="'+one._id+'" >'+one.name+'</option>';
                        }
                        $('#task_select').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }
            });
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'change #continents_select': 'selectContinent',
            'change #country_select': 'selectCountry',
            'change #city_select': 'selectCity',
//            'change #attractions_en':'showLocations',
//            'change .labels':'savelabel',
            'click #addlabel':'addlabel',
            'click .del':'dellabel',
            'focus .labels':'autoget',
            'focus #masterLabel':'autogetMasterLabel',
            'click #allday' : 'selectAllDay',
            'click .editwords':'editwords',
            'click .textareasurebtn':'textareasure'
        },
        textareasure:function (e){
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords:function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        selectAllDay : function(e){
            e.preventDefault();
            $('#am').attr('checked','checked');
            $('#pm').attr('checked','checked');
            $('#ev').attr('checked','checked');
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
                        console.log(data);
                        var cities = data.cities;
                        var option = '<option value=""></option>';
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
            var cityid = $("#city_select").val();
            var name = $("#attractions").val();
            if(!cityid||!name){
                alert('城市和景点名称均不能为空！');
                if(!cityid) $("#city_select").focus();
                else $("#attractions").focus();
                return false;
            }

            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                var tmp_label = $('.labels').eq(i).attr('data-value');
                if(tmp_label!=null && tmp_label!='')
                    array_label.push(tmp_label);
            }
            var show_flag = $('#show_flag').prop('checked')?'1':'0';
            var index_flag = $('#index_flag').prop('checked')?'1':'0';
            var newAttractions = new weego.AttractionsModel({cityname:$("#city_select").find("option:selected").text(),
                cityid:$("#city_select").val(), attractions_en:$("#attractions_en").val(),
                address:$('#address').val(), price:$('#price').val(), opentime:$('#opentime').val(), traffic_info:$('#traffic_info').val(),
				tips:$('#tips').val(),
                dayornight:$('input:radio[name="dayornight"]:checked').val(),website:$("#website").val(), telno:$("#telno").val(),
                attractions:$("#attractions").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(),
                recommand_duration:$('#recommand_duration').val(),recommand_flag:$('input:radio[name="recommand_flag"]:checked').val(), 
                show_flag:show_flag,index_flag:index_flag,am:$('#am').prop('checked'),pm:$('#pm').prop('checked'),ev:$('#ev').prop('checked'),
                masterLabel:$("#masterLabel").attr('data-value'), subLabel:array_label, latitude:$("#latitude").val(), longitude:$("#longitude").val()});
            newAttractions.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert('保存失败');
                    } else {
                        var auditingModel = new weego.AuditingModel({
                            city_id:$("#city_select").val(),
                            city_name:$("#city_select").find("option:selected").text(),
                            task_id : $("#task_select").val(),
                            task_name : $("#task_select").find("option:selected").text(),
                            item_id : res._id,
                            editor_id : res.user_id,
                            type : '0',
                            log_type : '0',
                            name : $('#attractions').val()
                        });

                        auditingModel.save(null,{
                            success:function (model, res) {
                                if (!res.isSuccess) {
                                    alert('保存景点成功，但auditing保存失败！');
                                }else
                                    alert('保存成功');
                                self.location = '#attractions';
                                // weego.defaultView.getData(weego.currentPage, model.get('cityname'));
                            },
                            error:function () {
                                alert('保存景点成功，但auditing保存失败！');
                            }
                        });
                    }
                },
                error:function () {
                    alert('保存失败');
                }
            });
            return false;
        }
    });
    weego.CityPreView = Backbone.View.extend({
        tagName:'div',
        initialize:function(){
            
        },
        render:function(data){
            weego.result = data.results,
                editor = data.editor;
            $(this.el).html(Handlebars.compile($('#city_preview').html())({city:weego.result,editor:editor}));
            return this;
        },
        events:{
            'click #modify':'modify'
        },
        modify:function(){
            console.log(weego.result);
            var EditCityView = new weego.EditCityView();
            $('#app').html('').append(EditCityView.render(weego.result).$el);
        }
    });
    weego.EditCityView = Backbone.View.extend({
        tagName:"div",
        className:"modal fade in",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function (data) {
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var result = data;
            $(this.el).html(Handlebars.compile($('#cityEditView').html())({city:result}));
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'click #addlabel':'addlabel',
            'click #addTip':'addTip',
            'click #addIntr':'addIntr',
            'click #addTra':'addTra',
            'focus .labels':'autogetMasterLabel',
            'focus #masterLabel':'autogetMasterLabel',
            'click .del':'dellabel',
            'click .delTip':'delTip',
            'click .delIntr':'delIntr',
            'click .delTra':'delTra',
            'change #continents':'selectCountry',
            'click .editwords':'editwords',
            'click .textareasurebtn':'textareasure'
        },
        textareasure:function (e){
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords:function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },delTip:function (e) {
            $(e.target).parents('.tip-control').remove();
        },
        delTra:function (e) {
            $(e.target).parents('.tra-control').remove();
        },
        delIntr:function (e) {
            $(e.target).parents('.intr-control').remove();
        },
        autogetMasterLabel:function (e) {
            var _this = this;
            if ($(e.target).attr('id') == 'masterLabel') {
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
                                                masterLbale_id:item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select:function (event, ui) {
                        $(e.target).attr('data-value', ui.item.masterLbale_id);
                    }
                });
            } else {
                $(".labels").autocomplete({
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
                        $(e.target).attr('data-value', ui.item.sublevel_id);
                    }
                });
            }
        },
        showCityLocations:function () {
            locationCity();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        addTip:function () {
            var $newtip = $('<div class="controls tip-control"><input class="input-xlarge focused tipItemTitle"  name="tipItemTitle" data-value="" type="text" id="tipItemTitle">'+
                '<input type="button" value="删除" class="delTip"><textarea class="tipItemContent" id="tipItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.tip-control').last().after($newtip);
        },
        addTra:function () {
            var $newtra = $('<div class="controls tra-control"><input class="input-xlarge focused traItemTitle"  name="traItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delTra"><textarea class="traItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.tra-control').last().after($newtra);
        },
        addIntr:function () {
            var $newintr = $('<div class="controls intr-control"><input class="input-xlarge focused intrItemTitle"  name="intrItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delIntr"><textarea class="intrItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.intr-control').last().after($newintr);
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            var array_tips = [];
            for (var i = 0; i < $('.tipItemTitle').length; i++) {
                var tipItem = {};
                tipItem.tipItemTitle = $('.tipItemTitle').eq(i).val();
                tipItem.tipItemContent = $('.tipItemContent').eq(i).val();
                array_tips.push(tipItem);
            }
            var array_tra = [];
            for (var i = 0; i < $('.traItemTitle').length; i++) {
                var traItem = {};
                traItem.traItemTitle = $('.traItemTitle').eq(i).val();
                traItem.traItemContent = $('.traItemContent').eq(i).val();
                array_tra.push(traItem);
            }
            var array_intr = [];
            for (var i = 0; i < $('.intrItemTitle').length; i++) {
                var intrItem = {};
                intrItem.intrItemTitle = $('.intrItemTitle').eq(i).val();
                intrItem.intrItemContent = $('.intrItemContent').eq(i).val();
                array_intr.push(intrItem);
            }
            var recommand_center = {};
            recommand_center.name = $("#recommand_center_name").val();
            recommand_center.latitude = $("#recommand_center_latitude").val();
            recommand_center.longitude = $("#recommand_center_longitude").val();
            recommand_center._id = 'center';

            _this.model.save({
                continents:$("#continents option:selected").text(),
                continentscode:$("#continents").val(),
                cityname:$("#cityname").val(),
                cityname_en:$("#cityname_en").val(),
                cityname_py:$("#cityname_py").val(),
                countryname:$("#country option:selected").text(),
                countrycode:$("#country").val(),
                introduce:array_intr,
                short_introduce:$("#short_introduce").val(),
                restaurant_overview:$("#restaurant_overview").val(),
                shopping_overview:$("#shopping_overview").val(),
                attraction_overview:$("#attraction_overview").val(),
                tips:array_tips,
                traffic:array_tra,
                recommand_day:$("#recommand_day").val(),
                recommand_indensity:$("#recommand_indensity").val(),
                recommand_center : recommand_center,
                hot_flag:$('input:radio[name="hot_flag"]:checked').val(),
                show_flag:$('input:radio[name="show_flag"]:checked').val(),
                label:array_label, masterLabel:$("#masterLabel").attr('data-value'),
                latitude:$("#latitude").val(),
                longitude:$("#longitude").val(),
                weoid:$("#weoid").val()
            }, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        alert('保存成功');
                        $("#attractionsDetailDialog").new_modal('hide');
                        weego_city.defaultView.getData(weego_city.currentPage);
                    }
                },
                error:function () {
                    console.log("tianjiashibai");
                }
            });
            return false;
        },
        selectCountry: function(){
            var continentCode =  $("#continents").val();
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
                        $('#country').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }
                    
            });
        }
    });
    //edit city view
    weego.ShowAttractionsDetailView = Backbone.View.extend({
        tagName:"div",
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
            if(weego_user.globalUser.type == 1){
                 _this.model.set('_show_flag',true);
            }else{
                _this.model.set('_show_flag',false);
            }
            var template = Handlebars.compile($("#attractions_detail_template").html());
            _this.model.set('user',weego_user.globalUser);
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            _this.initSelect();
            return this;
        },
        initSelect: function(){
            $.ajax({
                url:"/getMyToDoTasks",
                success:function (data) {
                    if(data.status){
                        var results = data.results;
                        var option = '';
                        for(var i=0;i<results.length;i++){
                            var one = results[i];
                            option +='<option value="'+one._id+'" >'+one.name+'</option>';
                        }
                        $('#task_select').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }
            });
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'change #continents_select': 'selectContinent',
            'change #country_select': 'selectCountry',
            'change #city_select': 'selectCity',
            'click #addlabel':'addlabel',
            'click .del':'dellabel',
            'focus .labels':'autoget',
            'focus #masterLabel':'autogetMasterLabel',
            'click #cancel':'cancel',
            'click .close' : 'cancel',
            'click #allday' : 'selectAllDay',
            'click .editwords':'editwords',
            'click .textareasurebtn':'textareasure'
        },
        textareasure:function (e){
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords:function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        selectAllDay : function(e){
            e.preventDefault();
            $('#am').attr('checked','checked');
            $('#pm').attr('checked','checked');
            $('#ev').attr('checked','checked');
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
                        var option = '<option value=""></option>';
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
                var tmp_label = $('.labels').eq(i).attr('data-value');
                if(tmp_label!=null && tmp_label!='')
                    array_label.push(tmp_label);
            }
            var show_flag = $('#show_flag').prop('checked')?'1':'0';
            var index_flag = $('#index_flag').prop('checked')?'1':'0';
            _this.model.save({cityname:$("#city_select").find("option:selected").text(),
                cityid:$("#city_select").val(), attractions_en:$("#attractions_en").val(),
                attractions:$("#attractions").val(), address:$('#address').val(), price:$('#price').val(), opentime:$('#opentime').val(),
                traffic_info:$('#traffic_info').val(),dayornight:$('input:radio[name="dayornight"]:checked').val(),
                website:$("#website").val(), telno:$("#telno").val(), introduce:$("#introduce").val(),
                tips:$('#tips').val(),
                short_introduce:$("#short_introduce").val(), recommand_flag:$('input:radio[name="recommand_flag"]:checked').val(),
                recommand_duration:$('#recommand_duration').val(),show_flag:show_flag,index_flag:index_flag,
                am:$('#am').prop('checked'),pm:$('#pm').prop('checked'),ev:$('#ev').prop('checked'),
                masterLabel:$("#masterLabel").attr('data-value'), subLabel:array_label,
                latitude:$("#latitude").val(), longitude:$("#longitude").val()}, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        var auditingModel = new weego.AuditingModel({
                            city_id:$("#city_select").val(),
                            city_name:$("#city_select").find("option:selected").text(),
                            task_id : $("#task_select").val(),
                            task_name : $("#task_select").find("option:selected").text(),
                            item_id : res._id,
                            editor_id : res.user_id,
                            type : '0',
                            log_type : '1',
                            name : $('#attractions').val()
                        });

                        auditingModel.save(null,{
                            success:function (model, res) {
                                if (!res.isSuccess) {
                                    alert('保存景点成功，但auditing保存失败！');
                                }else
                                    alert('保存成功');
                                window.history.back();
                                // self.location="#attractions";
                            },
                            error:function () {
                                alert('保存景点成功，但auditing保存失败！');
                                window.history.back();
                            }
                        });
                    }
                },
                error:function () {
                    console.log("tianjiashibai");
                }
            });
            return false;
        },
        cancel:function () {
            window.history.back();
            //$("#attractionsDetailDialog").new_modal('hide');
        }
    });

    weego.AttractionsView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    _this.model.set('user',weego_user.globalUser);
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
            var attractionId =  $(e.currentTarget).attr('data-value');
            self.location = '#attraction/'+attractionId;
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
    
    weego.AllCountriesView = Backbone.View.extend({
        render:function(data){
            var asCountries = [],
                euCountries = [],//欧洲
                afCountries = [],
                saCountries = [],
                ocCountries = [],
                naCountries = [];
            for(var i = 0; i<data.length; i++){
                switch (data[i].continentscode){
                    case 'AS' :
                        asCountries.push(data[i].countryname);
                        asCountries = distinct(asCountries);
                        break;
                    case 'EU' :
                        euCountries.push(data[i].countryname);
                        euCountries = distinct(euCountries);
                        break;
                    case 'AF' :
                        afCountries.push(data[i].countryname);
                        afCountries = distinct(afCountries);
                        break;
                    case 'SA' :
                        saCountries.push(data[i].countryname);
                        saCountries = distinct(saCountries);
                        break;
                    case 'OC' :
                        ocCountries.push(data[i].countryname);
                        ocCountries = distinct(ocCountries);
                        break;
                    case 'NA' :
                        naCountries.push(data[i].countryname);
                        naCountries = distinct(naCountries);
                        break
                }
            }
            $(this.el).html(Handlebars.compile($('#allCountries').html())({
                asCountries: asCountries,
                euCountries: euCountries,
                afCountries: afCountries,
                saCountries: saCountries,
                ocCountries: ocCountries,
                naCountries: naCountries
            }));
            return this;
        }
    })
    
    weego.CountryCitiesView = Backbone.View.extend({
        render:function(countryname){
            $(this.el).html(Handlebars.compile($('#countrycities').html())({countryname:countryname}));
            return this;
        }
    })

    weego.AppView = Backbone.View.extend({
        el:'#app',
        query:{},

        initialize:function (options) {
            var thisView=this;
            console.log(options.cityname+"的景点");
            thisView.cityname=options.cityname;
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendAttractions', 'addAttractions', 'getData');
            this.collection = new weego.AttractionsColletion();
            this.collection.on('add', this.appendAttractions);
        },
        render:function (cityname) {
            var thisView=this;
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#appView").html());
            $(template({user:weego_user.globalUser,cityname:thisView.cityname})).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addAttractionsButton':'addAttractions',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage',
            'click #search-city-button':'search'
        },
        search:function(){
            var cityname = $('#search-city-cityname').val();
            var attrname = $('#search-city-attraction').val();
            self.location = '#attractions/1/q_'+cityname+'/q_'+attrname;
        },
        addAttractions:function () {
            // new weego.AttractionsDetailView().render(this).$el.new_modal({
            //     "show":true,
            //     "z_index":weego.z_index++
            // });
            // initialize();
            self.location = '#attraction/new';
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
            // if (weego.name != '') {
            //     self.location = "#city/" + weego.name + "/" + weego.currentPage;
            // } else {
            //     self.location = "#attractions/" + weego.currentPage;
            // }
            self.location = "#attractions/" + weego.currentPage+'/q_'+this.query.cityname+'/q_'+this.query.attrname;
        },
        prePage:function () {
            if (weego.currentPage > 1) {
                weego.currentPage = parseInt(weego.currentPage) - 1;
                self.location = "#attractions/" + weego.currentPage+'/q_'+this.query.cityname+'/q_'+this.query.attrname;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index,query) {
            this.query = query;
            var _this = this;
            var cityname = name || "";
            $.ajax({
                url:'/getAttractionsByPage/' + weego.limit + '/' + _index + '?cityname='+query.cityname+'&attrname='+query.attrname,
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
                    if(!isNull(query.cityname)){
                        _this.$('#search-city-cityname').attr('value',query.cityname);
                    }
                    if(!isNull(query.attrname)){
                        $('#search-city-attraction').val(query.attrname);
                    }
                }
            });
        }
    });
    weego.StatisticsView = Backbone.View.extend({
        el:"#app",
        initialize:function(){
            var thisView=this;
            if(weegoCache.statisticsTpl){
                thisView.$el.empty().append(weegoCache.statisticsTpl);
                thisView.initBar();
            }else{
                $("<div/>").load("/templ/statistics.handlebars",function(){
                    var template = Handlebars.compile($(this).html());
                    weegoCache.statisticsTpl=template();
                    thisView.$el.empty().append(template());
                    thisView.initBar();
                });
            }
        },
        //fake data
        initBar:function(){
            $('.statistics_bar').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: '数据统计'
                },
                xAxis: {
                    categories: ['城市', '景点', '酒店']
                },
                yAxis: {
                    title: {
                        text: '数量'
                    }
                },
                series: [{
                    name: '总数',
                    data: [50, 200, 54]
                }, {
                    name: '已有',
                    data: [16, 103, 5]
                }]
            });
        },
        events:{}
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
        // var address = document.getElementById('cityname').value;
        var address = $("#city_select").find("option:selected").text();
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

    function distinct(data) {
        var b = [];
        var obj = {};
        for (var i = 0; i < data.length; i++) {
            obj[data[i]] = data[i];
        }
        for (var a in obj) {
            b.push(obj[a]);
        }
        return b;
    };



}(weego));