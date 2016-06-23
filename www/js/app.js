// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

(function() {

  'use strict';

  var guide = {
    MODULE: 'guide',
    dependencies: [
      'ionic',
      'ngCordova',
      'ngMap',
      'ngResource',
      'guide.controllers',
      'guide.factories',
      // 'guide.services'
    ]
  };

  angular.module(guide.MODULE, guide.dependencies)



  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      // controller: 'AccountController'
    })

    .state('login', {
      url: '/login',
      data: {
        loginRequired: false
      },
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })

    // Each tab has its own nav history stack:
    .state('tab.category', {
      url: '/category',
      data: {
        loginRequired: false
      },
      views: {
        'tab-category': {
          templateUrl: 'templates/tab-category-map.html',
          controller: 'CategoryController'
        }
      }
    })

    .state('tab.interest', {
      url: '/interest',
      data: {
        loginRequired: true
      },
      views: {
        'tab-interest': {
          templateUrl: 'templates/tab-interest-map.html',
          // controller: 'AccountCtrl',
        }
      }
    })

    .state('tab.ar', {
      url: '/ar',
      data: {
        loginRequired: false
      },
      views: {
        'tab-ar': {
          templateUrl: 'templates/tab-dash.html',
          // controller: 'AccountCtrl',
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      data: {
        loginRequired: false
      },
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountController',
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/category');

  })


  .run(function($ionicPlatform, $state, $rootScope, UserFactory, $cordovaToast) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var loginRequired = toState.data.loginRequired;
        if (loginRequired) {
          if (UserFactory.getUser().facebookId) {
            $cordovaToast.showLongBottom('Bienvenido').then(function(success) {
              // success
            }, function(error) {
              // error
            });
          } else {
            $cordovaToast.showLongBottom('Se debe iniciar sesión para acceder a esta pestaña').then(function(success) {
              event.preventDefault();
              return $state.go('login')
            }, function(error) {
              // error
            });
          }
        }
      });
    });
  });
})();
