/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego_city = {
    init:function () {
    }
};
$(weego_city.init());
(function (weego_city) {
    weego_city.currentPage = 1;
    weego_city.limit = 20;
    weego_city.sumpages = 1;
    weego_city.count = 0;
//    weego_city.GlobalRouter = Backbone.Router.extend({
//        routes:{
//            "city/:pageno":"city", //
//            "*actions":"index"
//        },
//        city:function (pageno) {
//            weego_city.currentPage = pageno;
//            weego_city.defaultView = new weego_city.AppView();
//            weego_city.defaultView.getData(weego_city.currentPage)
//        },
//        index:function () {
//            weego_city.currentPage = 1;
//            weego_city.defaultView = new weego_city.AppView();
//            weego_city.defaultView.getData(weego_city.currentPage)
//        }
//    });

    weego_city.CityModel = Backbone.Model.extend({
        urlRoot:'/city',
        idAttribute:"_id"
    });
    weego_city.CityCollection = Backbone.Collection.extend({
        model:weego_city.CityModel
    });
    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    weego_city.AddCityDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function (that) {
            this.that = that;
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
            var template = Handlebars.compile($("#add_city_template").html());
            $(template(_this.model)).appendTo(_this.$el);
            this.delegateEvents(this.events);
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
            'click .delTra':'delTra'
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        delTip:function (e) {
            $(e.target).parents('.tip-control').remove();
        },
        delTra:function (e) {
            $(e.target).parents('.tra-control').remove();
        },
        delIntr:function (e) {
            $(e.target).parents('.intr-control').remove();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        addTip:function () {
            var $newtip = $('<div class="controls tip-control"><input class="input-xlarge focused tipItemTitle"  name="tipItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delTip"><textarea class="tipItemContent" style="width:80%;height:50px"></textarea></div>');
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
        autogetMasterLabel:function (e) {
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
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                console.log($('.labels').eq(i));
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            var array_tips = [];
            for (var i = 0; i < $('.tipItemTitle').length; i++) {
                var tipItem = {};
                tipItem.tipItemTitle = $('.tipItemTitle').eq(i).attr('data-value');
                tipItem.tipItemContent = $('.tipItemContent').eq(i).val();
                array_tips.push(tipItem);
            }
            var array_tra = [];
            for (var i = 0; i < $('.traItemTitle').length; i++) {
                var traItem = {};
                traItem.traItemTitle = $('.traItemTitle').eq(i).attr('data-value');
                traItem.traItemContent = $('.traItemContent').eq(i).val();
                array_tra.push(traItem);
            }
            var array_intr = [];
            for (var i = 0; i < $('.intrItemTitle').length; i++) {
                var intrItem = {};
                intrItem.intrItemTitle = $('.intrItemTitle').eq(i).attr('data-value');
                intrItem.intrItemContent = $('.intrItemContent').eq(i).val();
                array_intr.push(intrItem);
            }
            var recommand_center = {};
            recommand_center.name = $("#recommand_center_name").val();
            recommand_center.latitude = $("#recommand_center_latitude").val();
            recommand_center.longitude = $("#recommand_center_longitude").val();
            recommand_center._id = 'center';


            var newAttractions = new weego_city.CityModel({
                continents:$("#continents").val(),
                cityname_py:$("#cityname_py").val(),
                cityname:$("#cityname").val(),
                cityname_en:$("#cityname_en").val(),
                countryname:$("#countryname").val(),
                introduce:array_intr,
                short_introduce:$("#short_introduce").val(),
                tips:array_tips,
                traffic:array_tra,
                recommand_day:$("#recommand_day").val(),
                recommand_indensity:$("#recommand_indensity").val(),
                recommand_center : recommand_center,
                hot_flag:$('input:radio[name="hot_flag"]:checked').val(),
                show_flag:$('input:radio[name="show_flag"]:checked').val(),
                masterLabel:$("#masterLabel").attr('data-value'),
                label:array_label,
                latitude:$("#latitude").val(),
                longitude:$("#longitude").val(),
                weoid:$('#weoid').val()
            });
            newAttractions.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                    } else {
                        alert('保存成功');
                        $("#attractionsDialog").new_modal('hide');
                        _this.that.getData(weego_city.currentPage);
                    }
                },
                error:function () {
                }
            });
            return false;
        }
    });

    weego_city.EditCityView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDetailDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function () {
            var _this = this;
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var template = Handlebars.compile($("#city_edit_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
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
            'click .delTra':'delTra'
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
                continents:$("#continents").val(),
                cityname:$("#cityname").val(),
                cityname_en:$("#cityname_en").val(),
                cityname_py:$("#cityname_py").val(),
                countryname:$("#countryname").val(),
                introduce:array_intr,
                short_introduce:$("#short_introduce").val(),
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
        }
    });

    weego_city.CityView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    var template = Handlebars.compile($("#cityView").html());
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete',
            'click .upload':'upload',
            'click .upload_background_img':'upload_background_img'
        },
        modify:function (e) {
            var EditCityView = new weego_city.EditCityView();
            EditCityView.model = this.model;
            EditCityView.render().$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            initialize();
        },
        delete:function (e) {
            console.log("delete user");
            var _this = this;
            var isConfirmed = confirm("是否删除用户");
            if (isConfirmed) {
                this.model.destroy({
                    success:function (model, response) {
                        _this.$el.remove();
                    }
                });
            }
        },
        upload:function () {
            var manageCoverImageView = new weego_city.ManageCoverImageView();
            manageCoverImageView.model = this.model;
            manageCoverImageView.render().$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            manageCoverImageView.unloadPic();
        },
        upload_background_img:function () {
            var manageBackgroundImageView = new weego_city.ManageBackgroundImageView();
            manageBackgroundImageView.model = this.model;
            manageBackgroundImageView.render().$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            manageBackgroundImageView.unloadPic();
        }
    });
    weego_city.ManageBackgroundImageView = Backbone.View.extend({
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
            var template = Handlebars.compile($('#manageBackgroundImageView').html());
            $(template()).appendTo(_this.$el);
            _this.$('#city_id').val(_this.model.get('_id'));
            var image = _this.model.get('backgroundimage');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadBackgroundImageView = new weego_city.UploadBackgroundImageView();
                    uploadBackgroundImageView.model = image[i];
                    uploadBackgroundImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            return this;
        },
        unloadPic:function () {
            var _this = this;
            var oBtn = document.getElementById("unloadPic");
            var oShow = document.getElementById("uploadedName");
            new AjaxUpload(oBtn, {
                action:"/citypic/upload_background_img",
                name:"upload",
                data:{
                    _id:_this.$('#city_id').val()
                },
                responseType:"json",
                onSubmit:function (file, ext) {
                },
                onComplete:function (file, response) {
                    var uploadBackgroundImageView = new weego_city.UploadBackgroundImageView();
                    uploadBackgroundImageView.model = response;
                    uploadBackgroundImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            });
        }
    });
    weego_city.UploadBackgroundImageView = Backbone.View.extend({
        tagName:'li',
        initialize:function () {
            _.bindAll(this, 'render', 'remove');
        },
        render:function () {
            var _this = this;
            var template = Handlebars.compile($('#cityUploadImageView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .btn-remove':'remove'
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#city_id').val();
            $.ajax({
                url:'/delBackgroundImage/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    //城市封面图片管理
    weego_city.ManageCoverImageView = Backbone.View.extend({
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
            var template = Handlebars.compile($('#manageCoverImageView').html());
            $(template()).appendTo(_this.$el);
            _this.$('#city_id').val(_this.model.get('_id'));
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadCoverImageView = new weego_city.UploadCoverImageView();
                    uploadCoverImageView.model = image[i];
                    uploadCoverImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('coverImageName');
            if(coverImageName){
                _this.$('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/city/imgsizeC2/'+coverImageName+'?rev='+Math.random()+'">'));
            }
            return this;
        },
        unloadPic:function () {
            var _this = this;
            var oBtn = document.getElementById("unloadPic");
            var oShow = document.getElementById("uploadedName");
            new AjaxUpload(oBtn, {
                action:"/citypic/upload",
                name:"upload",
                data:{
                    _id:_this.$('#city_id').val()
                },
                responseType:"json",
                onSubmit:function (file, ext) {
                },
                onComplete:function (file, response) {
                    var uploadCoverImageView = new weego_city.UploadCoverImageView();
                    uploadCoverImageView.model = response;
                    uploadCoverImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            });
        }
    });
    weego_city.UploadCoverImageView = Backbone.View.extend({
        tagName:'li',
        initialize:function () {
            _.bindAll(this, 'render', 'remove');
        },
        render:function () {
            var _this = this;
            var template = Handlebars.compile($('#uploadCoverImageView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .btn-remove':'remove',
            'click .setCoverImg':'setCoverImg'
        },
        setCoverImg:function () {
            var _this = this;
            var _id = $('#city_id').val();
            $.ajax({
                url:'/setCityCoverImg/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data) {
                        $('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/city/imgsizeC2/' + data + '?rev=' + Math.random() + '">'));
                    }
                }
            });
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#city_id').val();
            $.ajax({
                url:'/delCoverImage/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    weego_city.AppView = Backbone.View.extend({
        el:'#app',
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendCity', 'addCity', 'getData');
            this.collection = new weego_city.CityCollection();
            this.collection.on('add', this.appendCity);
        },
        render:function () {
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#cityappView").html());
            $(template()).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addCityButton':'addCity',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },
        addCity:function () {
            new weego_city.AddCityDetailView().render(this).$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            initialize();
        },
        appendCity:function (city) {
            var cityView = new weego_city.CityView();
            cityView.model = city;
            cityView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if (weego_city.currentPage >= weego_city.sumpages) {
                alert("没有下一页");
                return;
            }
            weego_city.currentPage = parseInt(weego_city.currentPage) + 1;
            self.location = "#city/" + weego_city.currentPage;
        },
        prePage:function () {
            if (weego_city.currentPage > 1) {
                weego_city.currentPage = parseInt(weego_city.currentPage) - 1;
                self.location = "#city/" + weego_city.currentPage;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index) {
            var _this = this;
            $.ajax({
                url:'/getCityByPage/' + weego_city.limit + '/' + _index,
                type:'GET',
                success:function (data) {
                    weego_city.count = data.count;
                    if (data && data.city && data.city.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        _this.$('#allcityno').html(weego_city.count);
                        _this.$('#current_page').html(weego_city.currentPage);
                        weego_city.sumpages = Math.ceil(weego_city.count / weego_city.limit);
                        _this.$('#sum_page').html(weego_city.sumpages);
                        for (var i = 0; i < data.city.length; i++) {
                            _this.collection.add(new weego_city.CityModel({cityname:data.city[i].cityname, introduce:data.city[i].introduce, location:data.city[i].location, _id:data.city[i]._id}));
                        }
                    } else {
                        if (weego_city.currentPage == 1) {
                            _this.render();
                            _this.$('#allcitysno').html('0');
                            _this.$('#current_page').html('1');
                            _this.$('#sum_page').html('1');
                            alert("暂时没有城市");
                        } else {
                            alert("无下一页");
                            weego_city.currentPage--;
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
    var city_location;

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
        var marker = new google.maps.Marker({
            position:latlng,
            map:map,
            title:'Hello World!'
        });
    }

    function locationCity() {
        var address = document.getElementById('cityname').value;
        geocoder.geocode({ 'address':address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                city_location = results[0].geometry.location;
                var latlng = new google.maps.LatLng(city_location.lat(), city_location.lng());
                $("#latitude").val(city_location.lat());
                $("#longitude").val(city_location.lng());
                var mapOptions = {
                    zoom:9,
                    center:latlng,
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                }
                map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
                var marker = new google.maps.Marker({
                    position:latlng,
                    map:map,
                    title:'Hello World!'
                });
            }
        });
    }

}(weego_city));