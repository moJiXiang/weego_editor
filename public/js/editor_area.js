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
        'click #cancel': 'back'
    },
    render: function(){
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
    back: function(){
        console.log('back!');
        window.history.back();
    },
    getTextInputValue: function(id){
        return this.$el.find('#'+id).val();
    },
    saveArea: function(e){
        var name = this.getTextInputValue('area-name');
        var city_name = $('#city_select').find("option:selected").text();
        if(name=='' || name==null || name==undefined){
            alert('名称不能为空！');
            return false;
        }
        if(city_name=='' || city_name==null || city_name==undefined){
            alert('城市不能为空！');
            return false;
        }
        var areaDetails = {
            name: name,
            city_name : city_name,
            city_id : $('#city_select').val(),
            en_name: this.getTextInputValue('area-en_name')
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
    },
    render: function(){
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

