var adminurl = "http://www.hiramanek.com/hiramanekBackend/index.php/";
var myservices = angular.module('myservices', [])

.factory('MyServices', function ($http, $location) {

    return {
        signup: function (user) {

            return $http.get(adminurl + "users/signup", {
                params: {
                    user: user
                }
            });
        },

        login: function (user) {
            return $http.get(adminurl + "users/login", {
                params: {
                    user: user
                }
            });
        },

        getvehiclesbytype: function (type, location1, location2) {
            return $http.get(adminurl + "categories/get_all", {
                params: {}
            });
        },
        getfullarticle: function (id) {
            /*http://localhost/hiramanekBackend/index.php/news/getbyid?id=2*/
            return $http.get(adminurl + "news/getfullarticalbynewsid", {
                params: {
                    id: id
                }
            });
        },
        gethomenews: function () {
            return $http.get(adminurl + "news/getlatestnewsfromallcategories", {
                params: {}
            });


        },
        getimages: function (id) {

            return $http.get(adminurl + "newsphotos/getallimagesofnews", {
                params: {
                    id: id
                }
            });


        },
        getcategoriesformenu: function () {
            console.log("service function");
            return $http.get(adminurl + "categories/getcategoriesnames", {
                params: {}
            });


        },
        getcatnews: function (id) {
            return $http.get(adminurl + "news/getnewsofonecategory", {
                params: {
                    category: id
                }
            });



        },
        getcatdata: function (id) {
            return $http.get(adminurl + "categories/getbyid", {
                params: {
                    id: id
                }
            });



        },
        validate: function(email)
        {
            return $http.get(adminurl + "users/checkemail", {
                params: {
                    email: email
                }
            });
        },
       changepassword:function(id,password){
            
            return $http.get(adminurl + "users/changepassword", {
                params: {
                    password: password,
                    id:id
                }
            });
            
            },
        sendcomment:function(comment,newsid,userid){
            return $http.get(adminurl + "comments/commentofuser", {
                params: {
                  
                    userid:userid,
                     newsid:newsid,
                    comment:comment
                }
            }); 
            
            
        },
        nextnews:function(count,category){
            
           return $http.get(adminurl + "news/getnexttennews", {
                params: {
                  count:count,
                category :category
                }
            });  
        },
        bloginsert: function(data)
        {
            return $http.get(adminurl + "news/insert", {
                params: {
                  data:data
                }
            });  
        },
        getepapers: function()
        {
            return $http.get(adminurl + "epapers/getall", {
                params: {}
            }); 
        },

    }
});