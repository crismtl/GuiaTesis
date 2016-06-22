(function() {

  'use strict';

  function LoginController($scope, $state, $q, UserFactory, $ionicLoading, UtilsFactory) {
    var fbLoginSuccess = function(response) {
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }

      getFacebookProfileInfo(response.authResponse)
        .then(function(profileInfo) {
          //TODO reducir codigo
          var date = UtilsFactory.getDateFromFacebook(profileInfo.birthday);
          var userResponse = {
            authResponse: response.authResponse,
            userId: profileInfo.id,
            firstName: profileInfo.first_name,
            lastName: profileInfo.last_name,
            email: profileInfo.email,
            birthday: date.getTime()
          };

          var user = UserFactory.getUserServer(userResponse);
          // console.log(user);
          UserFactory.factory.save(user, function(response) {
            UserFactory.setUser({
              id: response.id,
              facebookId: response.facebookId,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              birthday: response.birthday,
              facebookToken: response.facebookToken
            });
          });

          $ionicLoading.hide();
          $state.go('tab.interest');
        }, function(fail) {
          console.log('profile info fail', fail);
        });
    };

    var fbLoginError = function(error) {
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    var getFacebookProfileInfo = function(authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=id,first_name,last_name,birthday,email&access_token=' + authResponse.accessToken, null,
        function(response) {
          info.resolve(response);
        },
        function(response) {
          info.reject(response);
        }
      );
      return info.promise;
    };

    $scope.facebookSignIn = function() {
      facebookConnectPlugin.getLoginStatus(function(success) {
        if (success.status === 'connected') {
          console.log('getLoginStatus', success.status);

          var user = UserFactory.getUser();
          if (!user.id) {
            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {
                var date = UtilsFactory.getDateFromFacebook(profileInfo.birthday);
                var userResponse = {
                  authResponse: success.authResponse,
                  userId: profileInfo.id,
                  firstName: profileInfo.first_name,
                  lastName: profileInfo.last_name,
                  email: profileInfo.email,
                  birthday: date.getTime()
                };

                var user = UserFactory.getUserServer(userResponse);
                console.log(user);
                UserFactory.factory.save(user, function(response) {
                  UserFactory.setUser({
                    id: response.id,
                    facebookId: response.facebookId,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    birthday: response.birthday,
                    facebookToken: response.facebookToken
                  });
                });

                $state.go('tab.interest');
              }, function(fail) {
                console.log('profile info fail', fail);
              });
          } else {
            $state.go('tab.interest');
          }
        } else {
          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          facebookConnectPlugin.login(['public_profile', 'user_birthday', 'email'], fbLoginSuccess, fbLoginError);
        }
      });
    };

    $scope.skipLogIn = function() {
      $state.go('tab.category');
    };

  }

  angular.module('guide.controllers')
    .controller('LoginController', LoginController);
})();
