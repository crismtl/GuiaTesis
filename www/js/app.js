// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

(function () {

  'use strict';

  var guide = {
    MODULE: 'guide',
    dependencies: [
      'ionic',
      'ngCordova',
      'ngMap',
      'ngResource',
      'guide.controllers',
      'guide.factories'
    ]
  };

  angular.module(guide.MODULE, guide.dependencies)

    .run(function ($ionicPlatform, WikitudeFactory, $rootScope, $ionicLoading) {
      $ionicPlatform.ready(function () {
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
        WikitudeFactory.plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');

        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          $ionicLoading.show({
            template: 'Usted debería tener una conexión activa a Internet'
          });
        })

        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          $ionicLoading.hide();
        })
      });
    })


    .config(function ($stateProvider, $urlRouterProvider, UserFactoryProvider) {

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
          controller: 'AppController'
        })

        .state('tab.map', {
          url: '/map',
          views: {
            'tab-map': {
              templateUrl: 'templates/tab-map.html',
              controller: 'MapController'
            }
          }
        })

        .state('tab.loginInAccount', {
          url: '/login-in-account',
          views: {
            'tab-profile': {
              templateUrl: 'templates/login.html',
              controller: 'LoginController'
            }
          }
        })

        .state('tab.account', {
          url: '/account',
          views: {
            'tab-profile': {
              templateUrl: 'templates/tab-account.html',
              controller: 'AccountController'
            }
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/map');

    })

})();
