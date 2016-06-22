(function() {
  'use strict';

  function UserFactory($resource, ApiUrl) {
    return {
      setUser: function(user) {
        window.localStorage.user = JSON.stringify(user);
      },

      getUser: function() {
        return JSON.parse(window.localStorage.user || '{}');
      },

      factory: $resource(ApiUrl + '/user/:userId', {
        userId: '@userId'
      }),

      getUserServer: function(userResponse) {
        return {
          facebookId: userResponse.userId,
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          birthday: userResponse.birthday,
          email: userResponse.email,
          facebookToken: userResponse.authResponse.accessToken
        };
      }
    }
  }

  angular.module('guide.factories')
    .factory('UserFactory', UserFactory);

})();
