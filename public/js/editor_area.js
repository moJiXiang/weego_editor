/**
 * User: lb
 */

//---------------------------------model and collection-------------------------------------------------

var AreaModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/area'
});
var AreaCollection = Backbone.Collection.extend({
    url: '/areas/'+this.pageLimit+'/'+this.currentPage,
    model: AreaModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function(response){
        this.total = response.count;
        return response.areas;
    },
    hasPage: function(page){
        if(((page * this.pageLimit) - this.total) > this.pageLimit)
            return false;
        if(page == 0)
            return false;
        return true;
    },
    getByPage: function(limit, pageIndex, successCallback){
        this.url = '/areas/'+limit+'/'+pageIndex;
        this.fetch({success: successCallback});
    },
    getFirstPage: function(callback){
        this.getByPage(this.pageLimit, 1, callback);
    },
    getNextPage: function(successCallback){
        if(!this.hasPage(this.currentPage + 1))
            return;
        this.getByPage(this.pageLimit, ++this.currentPage, successCallback);
    },
    getPrevPage: function(successCallback){
        if(!this.hasPage(this.currentPage - 1))
            return;
        this.getByPage(this.pageLimit, --this.currentPage, successCallback);
    },
    getPage: function(page,successCallback){
        this.currentPage = page;
        this.getByPage(this.pageLimit, this.currentPage, successCallback);
    }
});



//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var AreaView = Backbone.View.extend({
    template: Handlebars.compile($('#areaDetailView').html()),
    initialize: function(){
        // alert('');
        this.template = Handlebars.compile($('#areaDetailView').html());
    },
    events: {
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'click #save': 'saveArea',
        'click #cancel': 'back',
        'click .addareatag': 'addareatag'
    },
    addareatag : function(e){
        console.log(' value=""');
        $el = $(e.currentTarget);
        var $taginput = '<input type="text" class="areatag">';
        $el.parent().append($taginput);
    },
    render: function(){
        this.model.set('user',weego_user.globalUser);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
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
    back: function(e){
        e.preventDefault();
        window.history.back();
    },
    getTextInputValue: function(id){
        return this.$el.find('#'+id).val();
    },
    saveArea: function(e){
        var city_id = $('#city_select').val();
        var city_name = $('#city_select').find("option:selected").text();
        var area_name = $('#area_name').val();
        var area_enname = $('#area_enname').val();
        var introdouce = $('#area-introduce').val();
        var address = $('#area-address').val();
        var latitude = $('#area-latitude').val();
        var longitude = $('#area-longitude').val();
        var traffic = $('#area-traffic').val();
        var tips = $('#area-tips').val();
        var tel = $('#area-tel').val();
        var website = $('#area-website').val();
        var opentime = $('#area-opentime').val();
        var areatags = [];
        for (var i = 0; i < $('.areatag').length; i++) {
            areatags.push($('.areatag').eq(i).val());
        };
        console.log(areatags);
        if(city_name=='' || city_name==null || city_name==undefined){
            alert('城市不能为空！');
            return false;
        }
        if(area_name=='' || area_name==null || area_name==undefined){
            alert('名称不能为空！');
            return false;
        }
        console.log(introdouce);
        var areaDetails = {
            city_id : city_id,
            city_name : city_name,
            area_name: area_name,
            area_enname: area_enname,
            area_introduce: introdouce,
            traffic: traffic,
            tips: tips,
            address: address,
            latitude: latitude,
            longitude: longitude,
            tel: tel,
            website: website,
            open_time: opentime,
            tags: areatags
        };
        if(this.model == null || this.model.get('_id') == null)
        {
            this.model = new AreaModel(areaDetails);
            this.model.save({},{
                success:function(){
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else{
            this.model.save(areaDetails, {
                success: function(){
                    alert('修改成功');
                    window.history.back();
                }
            });
        }

        e.preventDefault();
        return false;
    }
});

var AreaListView = Backbone.View.extend({
    template: Handlebars.compile($('#area-list-view').html()),
    events:{
        'click #area-list-prev-page': 'showPrevPage',
        'click #area-list-next-page': 'showNextPage',
    },
    initialize: function(data){
        var that = this;
        this.collection = new AreaCollection();
        this.collection.on('all', function(){
            $('#area-list-current-page').html(that.collection.currentPage);
            $('#area-list-total').html(that.collection.total);
            $('#area-list-page-count').html(Math.floor(that.collection.total/that.collection.pageLimit) + 1);
        });
    },
    showAreaList: function(collection){
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function(model){
            var areaListItemView = new AreaListItemView({model: model});
            areaListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function(){
        var that = this;
        this.collection.getFirstPage(function(collection){
            that.showAreaList(collection);
        })
    },
    showPrevPage: function(){
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showAreaList(collection);
//        });
        if(!this.collection.hasPage(parseInt(this.collection.currentPage)-1))
            return;
        Backbone.history.navigate('areas/'+(--this.collection.currentPage), {trigger:true});
    },
    showNextPage: function(){
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showAreaList(collection);
//        });
        if(this.collection.hasPage(parseInt(this.collection.currentPage)+1) === false)
            return;
        Backbone.history.navigate('areas/'+(++this.collection.currentPage), {trigger:true});
    },
    showByPage: function(page){
        var that = this;
        this.collection.getPage(page, function(collection){
            that.showAreaList(collection);
        });
    },
    render: function(){
        var that = this;
        this.$el.html(that.template({
//            currentPage: that.collection.currentPage,
//            pageCount: (that.collection.total/that.collection.pageLimit) + 1,
//            total: that.collection.total
                user:weego_user.globalUser
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});

var AreaListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#area-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #area-list-item-edit' : 'editArea',
        'click #area-list-item-remove' : 'removeArea',
        'click #manageimg':'manageimg'

    },
    manageimg: function(e) {
        e.preventDefault();
        var manageImageView = new weego.ManageImageView();
        manageImageView.model = this.model;
        manageImageView.render().$el.modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageImageView.unloadPic();
    },
    render: function(){
        this.model.set('user',weego_user.globalUser);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
   
    editArea : function(){
//        $('#app').off();
//        $('#app').empty();
//        (new AreaView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeArea : function(){
        this.model.destroy();
        this.$el.remove();
    }
});
// var ManageImageView = Backbone.View.extend({
//     tagName: "div",
//     className: "modal hide fade",
//     "id": "manageImageDialog",
//     initialize: function() {
//         _.bindAll(this, 'render');
//     },
//     render: function() {
//         var _this = this;
//         this.$el.css({
//             width: "100%",
//             height: "100%",
//             left: 0,
//             right: 0,
//             top: 0,
//             bottom: 0,
//             margin: 'auto',
//             position: 'relative'
//         });
//         var template = Handlebars.compile($('#manageImageView').html());
//         $(template()).appendTo(_this.$el);
//         _this.$('#zxx_id').val(_this.model.get('_id'));
//         var image = _this.model.get('image');
//         if (image && image.length > 0) {
//             for (var i = 0; i < image.length; i++) {
//                 var uploadImageView = new UploadImageView();
//                 uploadImageView.model = image[i];
//                 uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
//             }
//         }
//         var coverImageName = _this.model.get('coverImageName');
//         if (coverImageName) {
//             _this.$('#coverImageName').empty().append($('<img src="/attractionsimage/' + coverImageName + '?rev=' + Math.random() + '">'));
//         }
//         return this;
//     },
//     unloadPic: function() {
//         var _this = this;
//         var oBtn = document.getElementById("unloadPic");
//         var oShow = document.getElementById("uploadedName");
//         new AjaxUpload(oBtn, {
//             action: "/postimage",
//             name: "upload",
//             data: {
//                 _id: _this.$('#zxx_id').val()
//             },
//             responseType: "json",
//             onSubmit: function(file, ext) {},
//             onComplete: function(file, response) {
//                 var uploadImageView = new UploadImageView();
//                 uploadImageView.model = response;
//                 uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
//             }
//         });
//     }
// });
// var UploadImageView = Backbone.View.extend({
//     tagName: 'li',
//     initialize: function() {
//         _.bindAll(this, 'render', 'remove', 'setCoverImg');
//     },
//     render: function() {
//         var _this = this;
//         var template = Handlebars.compile($('#uploadImageView').html());
//         $(template(_this.model)).appendTo(_this.$el);
//         return this;
//     },
//     events: {
//         'click .btn-remove': 'remove',
//         'click .setCoverImg': 'setCoverImg'
//     },
//     setCoverImg: function() {
//         var _this = this;
//         var _id = $('#zxx_id').val();
//         $.ajax({
//             url: '/setCoverImg/' + _id + '/' + _this.model,
//             success: function(data) {
//                 if (data) {
//                     $('#coverImageName').empty().append($('<img src="/attractionsimage/' + data + '?rev=' + Math.random() + '">'));
//                 }
//             }
//         });
//     },
//     remove: function(e) {
//         var _this = this;
//         var _id = $('#zxx_id').val();
//         $.ajax({
//             url: '/delUploadImage/' + _id + '/' + _this.model,
//             success: function(data) {
//                 if (data.status == 'success') {
//                     _this.$el.remove();
//                 }
//             }
//         })
//     }
// });

