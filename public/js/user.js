/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-6-22
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */
var weego_user = {
    init:function () {
        if($.cookie('user')){
            this.loginFlag = true;
            this.globalUser = jQuery.parseJSON($.cookie('user'));
        }else{
            this.loginFlag = false;
            this.globalUser = {};
        }
    }
};
$(weego_user.init());
(function (weego_user) {
    // weego_user.loginFlag = false;
    weego_user.currentPage = 1;
    weego_user.sumpages = 1;
    weego_user.limit = 10;
    weego_user.z_index = 2000;
    weego_user.count = 0;
    weego_user.name;
    // weego_user.globalUser;

    weego_user.UserLoginModel = Backbone.Model.extend({
        urlRoot:'/login',
        idAttribute:"_id"
    });

    weego_user.UserModel = Backbone.Model.extend({
        urlRoot:'/user',
        idAttribute:"_id"
    });
    weego_user.UserCollection = Backbone.Collection.extend({
        model:weego_user.UserModel
    });

    weego_user.LoginView = Backbone.View.extend({
        el:'#app',
        render:function () {
            var _this = this;
            $('#app').empty();
            var template = Handlebars.compile($("#loginTemplate").html());
            $(template()).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #login':'login'
        },
        login:function () {
            if ($('#username').val() == '' || $('#password').val() == '') {
                $(".valid_wrong").fadeIn("slow");
                return false;
            }
            var userModel = new weego_user.UserLoginModel();
            userModel.set('username', $('#username').val());
            userModel.set('password', md5($('#password').val()));
            userModel.save(null,
                {
                    success:function (model, res) {
                        if (model.get('login') == true) {
                            weego_user.globalUser = {};
                            weego_user.globalUser.username = model.get('username');
                            weego_user.globalUser.type = model.get('type');
                            var cookieUser = {'username':weego_user.globalUser.username,'type':weego_user.globalUser.type};
                            $.cookie('user',JSON.stringify(cookieUser),{expires:1});
                            if (weego.globalCurrentUrl == '#login'||weego.globalCurrentUrl=='') {
                                weego.globalCurrentUrl = '#city/1';
                            }
                            weego_user.loginFlag = true;
                            self.location = weego.globalCurrentUrl;
                        } else {
                            $(".login_wrong").fadeIn("slow");
                        }
                    }
                });
        }
    });
    weego_user.UserView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            var template = Handlebars.compile($("#userView").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete'
        },
        modify:function (e) {
            var editUserDetailView = new weego_user.EditUserDetailView();
            editUserDetailView.model = this.model;
            editUserDetailView.render().$el.new_modal({
                "show":true,
                "z_index":weego_user.z_index++
            });
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
        }
    });
    weego_user.AppView = Backbone.View.extend({
        el:'#app',
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendUser', 'addUser', 'getData');
            this.collection = new weego_user.UserCollection();
            this.collection.on('add', this.appendUser);
        },
        render:function () {
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#userappView").html());
            $(template()).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addUser':'addUser',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },
        addUser:function () {
            new weego_user.UserDetailView().render().$el.new_modal({
                "show":true,
                "z_index":weego_user.z_index++
            });
        },
        appendUser:function (user) {
            var userView = new weego_user.UserView();
            userView.model = user;
            userView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if (weego_user.currentPage >= weego_user.sumpages) {
                alert("没有下一页");
                return;
            }
            weego_user.currentPage = parseInt(weego_user.currentPage) + 1;
            self.location = "#user/" + weego.currentPage;
        },
        prePage:function () {
            if (weego_user.currentPage > 1) {
                weego_user.currentPage = parseInt(weego_user.currentPage) - 1;
                self.location = "#user/" + weego.currentPage;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index, name) {
            var _this = this;
            $.ajax({
                url:'/getUserByPage/' + weego_user.limit + '/' + _index,
                type:'GET',
                success:function (data) {
                    weego_user.count = data.count;
                    if (data && data.user && data.user.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        for (var i = 0; i < data.user.length; i++) {
                            _this.collection.add(data.user[i]);
                        }
                    } else {
                        if (weego_user.currentPage == 1) {
                            _this.render();
                            alert("没有用户");
                        } else {
                            alert("无下一页");
                            weego_user.currentPage--;
                        }
                    }
                }
            });
        }
    });
    //add user view
    weego_user.UserDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"addUserDialog",
        render:function () {
            this.$el.css({
                position:'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#add_user_template").html());
            $(template()).appendTo(_this.$el);
            return this;
        },
        events:{
            'click #save':'save'
        },
        save:function () {
            var _this = this;
            if ($('#username').val() == '' || $('#password').val() == '') {
                alert('用户名或者密码不能为空');
                return false;
            }
            var newUser = new weego_user.UserModel({
                username:$('#username').val(),
                password:md5($('#password').val())
            });
            newUser.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert("cuole");
                    } else {
                        alert('保存成功');
                        $("#addUserDialog").new_modal('hide');
                        weego_user.defaultView.getData(weego_user.currentPage);
                    }
                }
            });
        }
    });
    weego_user.EditUserDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"editUserDialog",
        render:function () {
            this.$el.css({
                position:'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#edit_user_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            return this;
        },
        events:{
         'click #save':'save'
        },
        save:function(){
            var _this  = this;
            this.model.set('password',md5($('#password').val()))
            this.model.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert("cuole");
                    } else {
                        alert('保存成功');
                        $("#editUserDialog").new_modal('hide');
                        weego_user.defaultView.getData(weego_user.currentPage);;
                    }
                }
            });
        }
    });
    function md5(value) {
        var hash = hex_md5(value);
        return  hash;
    }
})(weego_user);