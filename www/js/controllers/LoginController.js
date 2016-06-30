(function () {

  'use strict';

  function LoginController($scope, $state, $q, UserFactory, $ionicLoading, UtilsFactory, FacebookFactory) {
    var fbLoginSuccess = function (response) {
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }

      FacebookFactory.getFacebookProfileInfo(response.authResponse)
        .then(function (profileInfo) {
          var user = FacebookFactory.convertUser(profileInfo, response.authResponse.accessToken);
          UserFactory.factory.save(user, function (response) {
            UserFactory.setUser(response);
          });

          $ionicLoading.hide();
          $state.go('tab.map');
        }, function (fail) {
          console.log('profile info fail', fail);
        });
    };

    var fbLoginError = function (error) {
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    $scope.facebookSignIn = function () {
      facebookConnectPlugin.getLoginStatus(function (success) {
          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          facebookConnectPlugin.login(['public_profile', 'user_birthday', 'email'], fbLoginSuccess, fbLoginError);
      });
    };

    $scope.skipLogIn = function () {
      $state.go('tab.category');
    };

  }

  angular.module('guide.controllers')
    .controller('LoginController', LoginController);
})();
