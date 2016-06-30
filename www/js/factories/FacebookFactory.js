(function () {
  'use strict';

  function FacebookFactory($q) {
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
      }
    };
    return factory;
  }

  angular.module('guide.factories')
    .factory('FacebookFactory', FacebookFactory);

})();
