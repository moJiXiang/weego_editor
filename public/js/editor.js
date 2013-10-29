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
//            if (!weego_user.loginFlag && route != 'login'&&route!='logout') {
            if (false && route != 'login'&&route!='logout') {
                weego.globalCurrentUrl = window.location.hash;
                self.location = "#login";
                return false;
            } else if (route != 'login') {
                $('.show-nav').fadeIn();
            }
            if (weego_user.globalUser) {
                if (weego_user.globalUser.get('type') == 1) {
                    $('#tab-user').fadeIn();
                }
            }
        },
        logout:function(){
            weego_user.loginFlag = false;
            weego_user.globalUser = null;
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
                    console.log(hotelModel);
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
        }
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
    Handlebars.registerHelper('ifHas', function(collection, value, options){
        var exist = false;
        _.each(collection, function(v){
            if(v == value)
                exist = true;
        });
        if(exist)
            return options.fn(this);
        return options.inverse(this);
    })
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
                address:$('#address').val(), price:$('#price').val(), opentime:$('#opentime').val(), 
				dayornight:$('input:radio[name="dayornight"]:checked').val(),website:$("#website").val(), telno:$("#telno").val(),
                attractions:$("#attractions").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(),
                recommand_flag:$('input:radio[name="recommand_flag"]:checked').val(), show_flag:$('input:radio[name="show_flag"]:checked').val(),
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
            _this.model.save({cityname:$("#cityname").val(), attractions_en:$("#attractions_en").val(), attractions:$("#attractions").val(), address:$('#address').val(), price:$('#price').val(), opentime:$('#opentime').val(),dayornight:$('input:radio[name="dayornight"]:checked').val(),
                website:$("#website").val(), telno:$("#telno").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(), recommand_flag:$('input:radio[name="recommand_flag"]:checked').val(),
                show_flag:$('input:radio[name="show_flag"]:checked').val(), masterLabel:$("#masterLabel").attr('data-value'), subLabel:array_label,
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
            _this.$('#attractions_id').val(_this.model.get('_id'));
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadImageView = new weego.UploadImageView();
                    uploadImageView.model = image[i];
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('coverImageName');
            if (coverImageName) {
                _this.$('#coverImageName').empty().append($('<img src="/attractionsimage/' + coverImageName + '?rev=' + Math.random() + '">'));
            }
            return this;
        },
        unloadPic:function () {
            var _this = this;
            var oBtn = document.getElementById("unloadPic");
            var oShow = document.getElementById("uploadedName");
            new AjaxUpload(oBtn, {
                action:"/postimage",
                name:"upload",
                data:{
                    _id:_this.$('#attractions_id').val()
                },
                responseType:"json",
                onSubmit:function (file, ext) {
                },
                onComplete:function (file, response) {
                    var uploadImageView = new weego.UploadImageView();
                    uploadImageView.model = response;
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            });
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
            var _id = $('#attractions_id').val();
            $.ajax({
                url:'/setCoverImg/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data) {
                        $('#coverImageName').empty().append($('<img src="/attractionsimage/' + data + '?rev=' + Math.random() + '">'));
                    }
                }
            });
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#attractions_id').val();
            $.ajax({
                url:'/delUploadImage/' + _id + '/' + _this.model,
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