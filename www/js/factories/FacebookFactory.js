(function () {
  'use strict';

  function FacebookFactory($q, $ionicLoading, UserFactory, $state) {
    var factory = {
      getFacebookProfileInfo: function (authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=id,first_name,last_name,birthday,email&access_token=' + authResponse.accessToken, null,
          function (response) {
            info.resolve(response);
          },
          function (response) {
            info.reject(response);
          }
        );
        return info.promise;
      },

      convertUser: function (profileInfo, accessToken) {
        return {
          facebookId: profileInfo.id,
          firstName: profileInfo.first_name,
          lastName: profileInfo.last_name,
          birthday: factory.getDateFromFacebook(profileInfo.birthday),
          email: profileInfo.email,
          facebookToken: accessToken
        }
      },

      getDateFromFacebook: function (date) {
        var current = date.split('/');
        return new Date(current[2], current[0] - 1, current[1]);
      },
      checkStatus: function (nextStateSuccess, nextStateFail) {
        $ionicLoading.show({
          template: 'Comprobando estado...'
        });
        facebookConnectPlugin.getLoginStatus(function (success) {
          if (success.status === 'connected') {
            console.log('getLoginStatus', success.status);
            factory.getFacebookProfileInfo(success.authResponse)
              .then(function (profileInfo) {
                var user = factory.convertUser(profileInfo, success.authResponse.accessToken);
                UserFactory.factory.update({id: user.id}, user, function (response) {
                  UserFactory.setUser(response);
                });
                $ionicLoading.hide();
                $state.go(nextStateSuccess);
              }, function (fail) {
                console.log('profile info fail', fail);
              });
          }
          else {
            $ionicLoading.hide();
            $state.go(nextStateFail);
          }
        });
      }
    };
    return factory;
  }

  angular.module('guide.factories')
    .factory('FacebookFactory', FacebookFactory);

})();
