(function() {

  'use strict';

  function UserInterestTypeFactory($resource, ApiUrl) {
    return {
      factory: $resource(ApiUrl + '/user-interest-type/:userInterestTypeId', {
        userInterestTypeId: '@userInterestTypeId'
      })
    }
  }

  angular.module('guide.factories')
    .factory('UserInterestTypeFactory', UserInterestTypeFactory);
})();
