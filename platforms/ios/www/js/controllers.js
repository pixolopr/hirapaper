angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $location, MyServices) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    /*// Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };*/

    $scope.gotoknowus = function () {
        $location.path("/app/knowus");
    };

    $scope.categorydata = [];
    var type = false;
    $scope.getcategory = function (id) {
        $location.path("/app/category/" + id);
    };

    $scope.gohome = function () {
        $location.path("/app/home");
    };
    $scope.gotoblog = function () {
        $location.path("/app/category/blog");
    };
    // type = $cordovaNetwork.isOffline();
    if (type == true) {
        console.log("hey");

    } else {
        console.log('called');

        MyServices.getcategoriesformenu().success(function (data, status) {
            $scope.categorydata = data;
            console.log($scope.categorydata);
            // $scope.$apply();
        });

    };

})

.controller('homeCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPlatform) {
    $scope.homenews = [];
    $scope.errormessage = "";

    //SHOW LOADING
    $ionicLoading.show({
        template: 'Fetching News...'
    });

    $scope.getarticle = function (id) {
        $location.path("/app/fullarticle/" + id);
    };

    //getting top 15 news
    var getnewssuccess = function (data, status) {
        $ionicLoading.hide();
        
        $scope.homenews = data;
        console.log(data);
    };
    var gethomenewserror = function (data, status) {
        $ionicLoading.hide();
        $scope.errormessage = "Seems like there is problem connecting to the server ";
    };
    MyServices.gethomenews().success(getnewssuccess).error(gethomenewserror);
    //IONIC REFRESHER FUNCTION
    $scope.dorefresh = function () {
        MyServices.gethomenews().success(getnewssuccess)
            .finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    



})

.controller('fullarticleCtrl', function ($scope, $stateParams, MyServices, $ionicLoading, $location, MyDatabase, $ionicPopup, $cordovaNetwork, $state) {



    var shownetpopup = function (message) {
        var myPopup = $ionicPopup.show({
            template: '',
            title: message,
            subTitle: '',
            buttons: [

                {
                    text: '<b>Refresh</b>',
                    type: 'button button-block button-positive',
                    onTap: function (e) {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }
      }, {
                    text: '<b>Home</b>',
                    type: 'button button-block button-positive',
                    onTap: function (e) {
                        $location.path("#/app/home");
                    }
      }
    ]
        });

    };
    $scope.$on('$ionicView.enter', function () {
        logincheck();

        /*CHECK INTERNET CONNECTION*/
        var nonetwork = function () {
            $ionicLoading.hide();
            $ionicPopup.show({
                template: '',
                title: 'You seem to have lost',
                subTitle: 'Internet Connection',
                scope: $scope,
                buttons: [
                    {
                        text: 'OK',
                        onTap: function (e) {
                            $location.path("#/app/home");
                        }
                    }
    ]
            });
        };
        var checkConnection = function () {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            if (networkState == Connection.NONE) {
                nonetwork();
                $scope.nonetworkconn = true;
            };
        };

        if ($stateParams.type) {
            console.log($stateParams.type);
            $scope.bookmark = true;
        } else {
            console.log('mahi hai');
            $scope.bookmark = false;
            checkConnection();
        };
    });



    //FETCH NEWS ID
    var newsid = $stateParams.newsid;
    if ($stateParams.type) {
        console.log($stateParams.type);
        $scope.bookmark = true;
    } else {
        console.log('mahi hai');
        $scope.bookmark = false;
    };
    $scope.logedin = false;
    $scope.userpost = {};
    $scope.userpost.comment = "";
    // $scope.textareastatus=`disabled`;
    //GO HOME BUTTON
    $scope.gohome = function () {
        $location.path("/app/home");
    };
    //Login check for post button
    var logincheck = function () {
        if ($.jStorage.get("user")) {
            if ($.jStorage.get("user").name) {
                $scope.logedin = true;
            };
        };
    };

    //Get updated comment
    var getupdatedcomment = function (data, status) {
        console.log(data);
        $scope.article.comments = data;
        $scope.userpost.comment = "";
        console.log($scope.article.comments);
    };

    //Send Comment
    $scope.sendcomment = function () {
        if ($scope.userpost.comment != "") {
            console.log($scope.userpost + " " + newsid + " " + $.jStorage.get("user").id);
            MyServices.sendcomment($scope.userpost.comment, newsid, $.jStorage.get("user").id).success(getupdatedcomment);
        };

    };

    var downloaderror = function () {
        MyDatabase.saveintobookmark($scope.article, $.jStorage.get("user").id, $scope, entry.toURL());
        var bookmarkerror = $ionicPopup.show({
            template: '',
            title: "Error Saving The Image",
            subTitle: '',
            buttons: [
                {
                    text: '<b>OK</b>',
                    type: 'button button-block button-positive',
                    onTap: function (e) {

                    }
      }
    ]
        });
    };

    //popup for confirmation
    var askconfirmation = function (msg) {
        var myPopup = $ionicPopup.show({
            template: '',
            title: msg,
            subTitle: '',
            buttons: [

                {
                    text: '<b>Yes</b>',
                    type: 'button button-block button-positive',
                    onTap: function (e) {
                        $ionicLoading.show({
                            template: 'Saving...'
                        });
                        var fileTransfer = new FileTransfer();
                        console.log($scope.article.photo);
                        var uri = encodeURI("http://www.hiramanek.com/hiramanekBackend/uploads/" + $scope.article.photo);

                        var slash = $scope.article.photo.lastIndexOf("/");
                        var res = $scope.article.photo.slice(slash + 1, $scope.article.photo.length);

                        console.log("aaya");
                        var savein = cordova.file.externalRootDirectory + res;


                        fileTransfer.download(
                            uri,
                            savein,
                            function (entry) {
                                $ionicLoading.hide();
                                console.log("download complete: " + entry.toURL());
                                console.log($scope.article);
                                MyDatabase.saveintobookmark($scope.article, $.jStorage.get("user").id, $scope, entry.toURL());
                            },
                            function (error) {
                                $ionicLoading.hide();
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code" + error.code);
                                console.log($scope.article);
                                downloaderror();
                            },
                            false, {
                                headers: {
                                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                                }
                            }
                        );
                        //MyDatabase.saveintobookmark($scope.article, $.jStorage.get("user").id, $scope);
                    }

      },
                {
                    text: '<b>No</b>',
                    type: 'button button-block button-positive',
                    onTap: function (e) {

                    }
      }
    ]
        });

    };
    $scope.showsuccesspop = function (msg) {
        var myPopup = $ionicPopup.show({
            template: '',
            title: msg,
            subTitle: '',
            buttons: [
                {
                    text: '<b>Ok</b>',
                    type: 'button button-block button-positive',
                    onTap: function (e) {}
            }]
        });
    };

    //Save to Bookmark
    $scope.savenews = function () {
            if ($scope.logedin == true) {
                askconfirmation('Do you really want to save this news in bookmark ?');
            } else {
                $scope.showsuccesspop('Sorry ! You are not logged in. Please login!');
            }

        }
        //GO TO GALLERY
    $scope.opengallery = function (id) {
        $location.path("/app/gallery/" + id);
    };
    //getting data
    // MyServices.getfullarticle(newsid).success(fullarticlesuccess);

    //SHOW LOADING
    $ionicLoading.show({
        template: 'Loading...'
    });

    //FETCH NEWS ARTICLE
    $scope.bookmarkarticle = function (data) {
        $scope.article = data;
        $ionicLoading.hide();
    };

    var fullarticlesuccess = function (data, status) {
        $ionicLoading.hide();
        //Check internet connection
        var type = false;
        // type = $cordovaNetwork.isOffline();
        //  console.log($cordovaNetwork.isOffline());
        if (type == true) {
            shownetpopup('No internet connection !');
            console.log($cordovaNetwork.isOffline());
        };
        console.log(data);
        $scope.article = data;
    };
    if ($scope.bookmark) {
        console.log('bookmark se le');
        MyDatabase.getfullarticle(newsid, $scope);
    } else {
        MyServices.getfullarticle(newsid).success(fullarticlesuccess);
    };


})

.controller('categoryCtrl', function ($scope, $stateParams, $location, MyServices, MyDatabase, $ionicPopup) {
    $scope.catid = $stateParams.catid;

    console.log($scope.catid);

    var user = null;

    $scope.$on('$ionicView.enter', function () {

        user = $.jStorage.get("user");
        console.log(user);

        if ($scope.catid == 'bookmark') {
            $scope.showmorenewsbutton = false;
        } else {
            $scope.showmorenewsbutton = true;
        };
        $scope.spinner = false;
        $scope.nomorenews = false;

        /*CHECK INTERNET CONNECTION*/
        var nonetwork = function () {
            $ionicPopup.show({
                template: '',
                title: 'You seem to have lost',
                subTitle: 'Internet Connection',
                scope: $scope,
                buttons: [
                    {
                        text: 'OK'
                    }
    ]
            });
        };
        var checkConnection = function () {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            if (networkState == Connection.NONE) {
                nonetwork();
                $scope.nonetworkconn = true;
            };
        };

        if ($scope.catid == "bookmark") {
            MyDatabase.getbookmarks($scope);
        } else {
            checkConnection();
            MyServices.getcatnews($scope.catid).success(categorywisenews);
        };


        //GET CATEGORY NAME
        $scope.categoryname = {};
        if ($scope.catid == "bookmark") {
            $scope.categoryname.name = "your bookmarks";
        } else {
            if ($scope.catid == "blog") {
                $scope.categoryname.name = "blog";
            } else {
                MyServices.getcatdata($scope.catid).success(function (data, status) {
                    $scope.categoryname = data;
                });
            };
        };


    });

    //GO HOME
    $scope.gohome = function () {
        $location.path("/app/home");
    };

    //GO TO CREATE BLOG
    $scope.create = function () {
        if (user != null) {
            $location.path("/app/writeblog");
        } else {
            $ionicPopup.show({
                template: '',
                title: 'You need to login',
                subTitle: 'to create a blog',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Login</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            $location.path("/app/settings");
                        }
      }
    ]
            });
        };
    };

    //GET NEWS BY CATEGORY
    var categorywisenews = function (data) {
        console.log(data);
        $scope.categorynews = data;
    };

    $scope.bookmarknews = function (data) {
        $scope.categorynews = [];
        $scope.categorynews = data;
        $scope.$apply();
        console.log($scope.categorynews);
    };



    //OPEN FULL ARTICLE
    $scope.getarticle = function (id) {
        if ($scope.catid == "bookmark") {
            $location.path("/app/fullarticle/" + id + "/bookmark");
        } else {
            $location.path("/app/fullarticle/" + id);
        };
    };

    //GET NEXT NEWS
    var morenewssuccess = function (data, success) {
        if (data.length) {
            $scope.showmorenewsbutton = true;
            $scope.spinner = false;
            $scope.categorynews.push(data);
        } else {
            $scope.showmorenewsbutton = false;
            $scope.nomorenews = true;
            $scope.spinner = false;
        };
    };

    $scope.getmorenews = function () {
        $scope.spinner = true;
        $scope.showmorenewsbutton = false;
        if ($scope.catid == 'bookmark') {
            MyDatabase.getbookmarks($scope);
        } else {
            MyServices.nextnews($scope.categorynews.length, $scope.catid).success(morenewssuccess);
        };
    };

    //REFRESH BOOKMARKS
    $scope.refreshbookmarks = function () {
        MyDatabase.getbookmarks($scope);
    };

    //REMOVE BOOKMARK FROM DATABASE
    var removebookmark = function (id) {
        MyDatabase.removebookmark(id, $scope);
    };

    //HOLD POP - UP
    $scope.holdpopup = function (id) {
        if ($scope.catid == "bookmark") {
            $ionicPopup.show({
                template: '',
                title: 'News Selected',
                subTitle: '',
                buttons: [
                    {
                        text: '<b>Read</b>',
                        type: 'button button-block button-positive',
                        onTap: function (e) {
                            $location.path("/app/fullarticle/" + id);
                        }
            },
                    {
                        text: '<b>Delete</b>',
                        type: 'button button-block button-positive',
                        onTap: function (e) {
                            //DELETE NEWS FROM BOOKMARK HERE
                            removebookmark(id);
                        }
            }]
            });
        };
    };

    



})

.controller('settingsCtrl', function ($scope, $stateParams, $location) {

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };

        $scope.$on('$ionicView.enter', function () {
            console.log('entering in view');
            $scope.user = null;
            if ($.jStorage.get("user").name) {
                if ($.jStorage.get("user").name != "") {
                    $scope.user = $.jStorage.get("user");
                    console.log($scope.user);
                }
            };
        });

        $scope.login = function () {
            //OPEN LOGIN PAGE HERE

            $location.path("/app/login");
            $location.replace();
        };

        $scope.signup = function () {
            //OPEN LOGIN PAGE HERE
            $location.path("/app/signup");

        };

        $scope.logout = function () {
            //HERE FLUSH THE JSTORAGE OR EMPTY USER
            $.jStorage.set("user", {});
            $scope.user = null;
        };

    })
    .controller('loginCtrl', function ($scope, $stateParams, $location, MyServices) {

        $location.replace();
        console.log($location);

        //INITIALISING LOGINDATA
        $scope.logindata = {};
        $scope.logindata.email = "";
        $scope.logindata.password = "";

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };


        //WHEN CLICKED ON lOGIN  BUTTON ON SUCCESS GO TO SETTINGS
        var loginsuccess = function (data, status) {
            console.log(data);
            if (data != 'false') {
                $.jStorage.set("user", data);
                $scope.user = $.jStorage.get("user");
                $location.path("/app/settings");
            } else {
                $scope.errormessage = "E-mail and password do not match";
            };

        };

        //CLEAR ERROR
        $scope.clearerror = function () {
            $scope.errormessage = "";
        };

        $scope.login = function () {
            if ($scope.logindata.email != "" && $scope.logindata.password != "") {
                //PERFORM VALIDATIONS HERE

                MyServices.login($scope.logindata).success(loginsuccess);
            } else {
                $scope.errormessage = "Please enter e-mail id and password";
            };
        }


    })
    .controller('forgotCtrl', function ($scope, $location, MyServices) {
        $scope.forgotdata = {};

        $scope.forgotdata.current = '';
        $scope.forgotdata.newpass = '';
        $scope.forgotdata.confirmpass = '';

        $scope.errormessage = '';

        //CLEAR ERROR
        $scope.clearerror = function () {
            $scope.errormessage = "";
        };

        var user = $.jStorage.get("user");

        var changepasssuccess = function (data, status) {
            user.password = $scope.forgotdata.newpass;
            $.jStorage.set("user", user);
            $location.replace();
            $location.path("/app/settings");
        };

        $scope.changepass = function () {
            if (user.password == $scope.forgotdata.current) {
                if ($scope.forgotdata.newpass == $scope.forgotdata.confirmpass) {
                    //CALL FORGOT PASSWORD API HERE
                    MyServices.changepassword(user.id, $scope.forgotdata.newpass).success(changepasssuccess);
                } else {
                    $scope.errormessage = "The Passwords do not match";
                };
            } else {
                $scope.errormessage = "Current Password is entered incorrectly";
            };
        };
    })
    .controller('signupCtrl', function ($scope, $stateParams, $location, MyServices) {


        //INITIALISING SIGNUPDATA
        $scope.$on('$ionicView.enter', function () {
            $scope.signupdata = {};
            $scope.signupdata.name = "";
            $scope.signupdata.lastname = "";
            $scope.signupdata.contact = "";
            $scope.signupdata.email = "";
            $scope.signupdata.password = "";

            console.log("CTRL");
        });

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };

        //CLEAR ERROR
        $scope.clearerror = function () {
            $scope.errormessage = "";
        };

        //VALIDATE
        var validationsuccess = function (data, status) {
            if (data == "true") {
                $scope.errormessage = "Email id already in use...";
            } else {

            };
        };
        $scope.validate = function () {
            MyServices.validate($scope.signupdata.email).success(validationsuccess);
        };

        //WHEN CLICKED ON SIGN  BUTTON ON SUCCESS GO TO SETTINGS
        var signupsuccess = function (data, status) {
            console.log(data);
            if (data != 'false') {
                $.jStorage.set("user", data);
                $location.replace();
                $location.path("/app/settings");
            } else {
                $scope.errormessage = "E-mail address already exist";
            };
        };

        $scope.signup = function () {
            if ($scope.signupdata.name != "" && $scope.signupdata.lastname != "" && $scope.signupdata.contact != "" && $scope.signupdata.email != "" && $scope.signupdata.password != "") {
                //HERE CALL SIGN UP API            
                MyServices.signup($scope.signupdata).success(signupsuccess);
            } else {
                $scope.errormessage = "Please enter missing values";
            };
        };

    })
    .controller('galleryCtrl', function ($scope, $stateParams, $location, $ionicSlideBoxDelegate, $ionicModal, MyServices, $ionicLoading) {

        $scope.showmodal = false;

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };

        //GET NEWS ID
        var newsid = $stateParams.newsid;

        //GET ALL IMAGES
        $ionicLoading.show({
            template: 'Loading...'
        });
        var getimagedata = function (data, status) {
            $scope.images = data;
            $ionicLoading.hide();
        };
        MyServices.getimages(newsid).success(getimagedata);

        $ionicModal.fromTemplateUrl('image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.openModal();
            $scope.closeModal();
        });

        $scope.openModal = function () {
            $ionicSlideBoxDelegate.slide(0);
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };



        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        $scope.$on('modal.shown', function () {
            //When Modal Opens
        });

        // Call this functions if you need to manually control the slides
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.goToSlide = function (index) {
            $scope.modal.show();
            $ionicSlideBoxDelegate.slide(index);
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };



    })

.controller('knowusCtrl', function ($scope, $location) {
        $scope.gotohundiyagallery = function () {
            $location.path("/app/hundiyagallery");
        };

    })
    .controller('hundiyagalleryCtrl', function ($scope, $location, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup) {

        $scope.images = [];

        $scope.$on('$ionicView.enter', function () {

            /*CHECK INTERNET CONNECTION*/
            var nonetwork = function () {
                $ionicPopup.show({
                    template: '',
                    title: 'You seem to have lost',
                    subTitle: 'Internet Connection',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'OK'
                    }
    ]
                });
            };
            var checkConnection = function () {
                var networkState = navigator.connection.type;
                var states = {};
                states[Connection.UNKNOWN] = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI] = 'WiFi connection';
                states[Connection.CELL_2G] = 'Cell 2G connection';
                states[Connection.CELL_3G] = 'Cell 3G connection';
                states[Connection.CELL_4G] = 'Cell 4G connection';
                states[Connection.CELL] = 'Cell generic connection';
                states[Connection.NONE] = 'No network connection';

                if (networkState == Connection.NONE) {
                    nonetwork();
                } else {
                    if ($scope.images.length == 0) {
                        for (var i = 1; i <= 27; i++) {
                            $scope.images.push({
                                photo: "h" + i + ".jpg"
                            });
                        };
                    };
                    console.log($scope.images);
                };
            };

            checkConnection();
        });



        $scope.showmodal = false;

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };
        $ionicModal.fromTemplateUrl('image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.openModal();
            $scope.closeModal();
        });

        $scope.openModal = function () {
            $ionicSlideBoxDelegate.slide(0);
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        $scope.$on('modal.shown', function () {
            //When Modal Opens
        });

        // Call this functions if you need to manually control the slides
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.goToSlide = function (index) {
            $scope.modal.show();
            $ionicSlideBoxDelegate.slide(index);
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };


    })
    .controller('epapersCtrl', function ($scope, $stateParams, $location, MyServices, $sce) {

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };

        $scope.$on('$ionicView.enter', function () {

            /*CHECK INTERNET CONNECTION*/
            var nonetwork = function () {
                $ionicPopup.show({
                    template: '',
                    title: 'You seem to have lost',
                    subTitle: 'Internet Connection',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'OK'
                    }
    ]
                });
            };
            var checkConnection = function () {
                var networkState = navigator.connection.type;
                var states = {};
                states[Connection.UNKNOWN] = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI] = 'WiFi connection';
                states[Connection.CELL_2G] = 'Cell 2G connection';
                states[Connection.CELL_3G] = 'Cell 3G connection';
                states[Connection.CELL_4G] = 'Cell 4G connection';
                states[Connection.CELL] = 'Cell generic connection';
                states[Connection.NONE] = 'No network connection';

                if (networkState == Connection.NONE) {
                    nonetwork();
                    $scope.nonetworkconn = true;
                };
            };

            checkConnection();

        });

        var getepaperssuccess = function (data, status) {
            $scope.epapers = data;
            $scope.paperhtml = '';
            for (var i = data.length - 1; i >= 0; i--) {
                $scope.paperhtml += '<a class="item item-icon-left" href="#" onclick="window.open(\'http://www.hiramanek.com/hiramanekBackend/uploads/' + $scope.epapers[i].pdf + '\', \'_system\', \'location=yes\'); return false;"><i class="icon ion-ios-paper-outline"></i>' + $scope.epapers[i].name + '</a>';
            };
            console.log($scope.paperhtml);
            $scope.paperhtml = $sce.trustAsHtml($scope.paperhtml);
        };
        var getepaperserror = function (data, status) {
            alert('Problem connecting to the network, please try again');
        };
        MyServices.getepapers().success(getepaperssuccess).error(getepaperserror);

    })
    .controller('writeblogCtrl', function ($scope, $stateParams, $location, MyServices, $ionicLoading) {

        //GO HOME BUTTON
        $scope.gohome = function () {
            $location.path("/app/home");
        };

        $scope.$on('$ionicView.enter', function (e) {
            $scope.imgname = "";
        });

        //GET USER
        if ($.jStorage.get("user")) {
            var user = $.jStorage.get("user");
            $scope.blogdata = {
                language: 1,
                headline: "",
                shortheadline: "",
                photo: "",
                article: "",
                author: 0,
                top: 0,
                blog: 1,
                userid: user.id
            };
        } else {
            alert("You need to Login first");
        };

        //UPLOAD IMAGE
        $scope.imageuploaded = false;

        var win = function (data, status) {
            $ionicLoading.hide();
            console.log("SUCCESS");
            console.log(data);
        };
        var fail = function (error) {
            $ionicLoading.hide();
            console.log(error);
        };
        var onSuccess = function (imageURI) {
            $scope.imageuploaded = true;
            var image = document.getElementById('myImage');
            image.src = imageURI;

            console.log(imageURI);
            $ionicLoading.show({
                template: 'Uploading Image...'
            });

            $scope.imgname = imageURI.substr(imageURI.lastIndexOf('/') + 1);

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = $scope.imgname;
            options.mimeType = "image/jpeg";

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;
            options.chunkedMode = false;

            console.log(options);

            var ft = new FileTransfer();
            ft.upload(imageURI, encodeURI("http://www.hiramanek.com/hiramanekBackend/index.php/news/doupload"), win, fail, options, true);


        };
        var onFail = function (message) {
            alert('Failed because: ' + message);
        };
        //CLICK PHOTO BUTTON
        $scope.uploadimage = function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });
        };

        //UPLOAD THE BLOG
        var bloginsertsuccess = function (data, status) {
            $ionicLoading.hide();
            $location.path("/app/category/blog");
            console.log(data);
        };
        var bloginserterror = function (data, status) {
            console.log(data);
        };
        $scope.createblog = function () {
            console.log($scope.blogdata);
            $ionicLoading.show({
                template: 'Uploading Blog...'
            });
            $scope.blogdata.shortheadline = $scope.blogdata.headline;
            if ($scope.imgname != "") {
                $scope.blogdata.photo = $scope.imgname;
            };
            MyServices.bloginsert($scope.blogdata).success(bloginsertsuccess).error(bloginserterror);

        };






    });