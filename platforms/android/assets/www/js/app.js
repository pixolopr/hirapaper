// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

function initPushwoosh() {
  var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
  //if (device.platform == "Android") {
    registerPushwooshAndroid();
  //}

  /*if (device.platform == "iPhone" || device.platform == "iOS") {
    registerPushwooshIOS();
  }

  if (device.platform == "Win32NT") {
    registerPushwooshWP();
  }*/

  pushNotification.getLaunchNotification(
    function(notification) {
      if (notification != null) {
        /*alert(JSON.stringify(notification));*/
      } else {
          /*NO LAUNCH NOTIFICATION*/
      }
    }
  );
}


angular.module('starter', ['ionic', 'starter.controllers', 'Mydatabase', 'myservices', 'ngCordova', 'ngMessages', ])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        initPushwoosh();

    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider

            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.epapers', {
                url: '/epapers',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/epapers.html',
                        controller: 'epapersCtrl'
                    }
                }
            })
            .state('app.knowus', {
                url: '/knowus',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/knowus.html',
                        controller: 'knowusCtrl'
                    }
                }
            })
            .state('app.hundiyagallery', {
                url: '/hundiyagallery',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/hundiyagallery.html',
                        controller: 'hundiyagalleryCtrl'
                    }
                }
            })

        .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings.html',
                        controller: 'settingsCtrl'
                    }
                }
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'
                    }
                }
            })
            .state('app.signup', {
                url: '/signup',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/signup.html',
                        controller: 'signupCtrl'
                    }
                }
            })
            .state('app.forgot', {
                url: '/forgot',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/forgot.html',
                        controller: 'forgotCtrl'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'homeCtrl'
                    }
                }
            })
            .state('app.category', {
                url: '/category/:catid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/category.html',
                        controller: 'categoryCtrl'
                    }
                }
            })

        .state('app.gallery', {
            url: '/gallery/:newsid',
            views: {
                'menuContent': {
                    templateUrl: 'templates/gallery.html',
                    controller: 'galleryCtrl'
                }
            }
        })

        .state('app.fullarticle', {
                url: '/fullarticle/:newsid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/fullarticle.html',
                        controller: 'fullarticleCtrl'
                    }
                }
            })
            .state('app.fullbookmark', {
                url: '/fullarticle/:newsid/:type',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/fullarticle.html',
                        controller: 'fullarticleCtrl'
                    }
                }
            })
            .state('app.writeblog', {
                url: '/writeblog',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/writeblog.html',
                        controller: 'writeblogCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');

        $ionicConfigProvider.navBar.alignTitle('center');
    })
    .filter('timestampToISO', function () {
        return function (input) {
            input = new Date(input).toISOString();
            return input;
        };
    })
    .filter('imagepath', function () {
        return function (input) {
            return "http://www.hiramanek.com/hiramanekBackend/uploads/" + input;
        };
    })
    .filter('capitalize', function () {
        return function (input, all) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            return (!!input) ? input.replace(reg, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    })
    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    })
    .directive('errSrc', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('error', function () {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    });