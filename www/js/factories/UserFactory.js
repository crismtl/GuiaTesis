(function () {
  'use strict';

  function UserFactory($resource, ApiUrl) {
    return {
      setUser: function (user) {
        window.localStorage.user = JSON.stringify(user);
      },

      getUser: function () {
        return JSON.parse(window.localStorage.user || null);
      },

      factory: $resource(ApiUrl + '/user/:id', null, {
        update: {
          method: 'PUT'
        }
      })
    }
  }

  angular.module('guide.factories')
    .factory('UserFactory', UserFactory);

})();
