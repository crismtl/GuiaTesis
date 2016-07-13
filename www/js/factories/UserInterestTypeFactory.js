(function() {

  'use strict';

  function UserInterestTypeFactory($resource, ApiUrl) {
    return {
      factory: $resource(ApiUrl + '/user-interest-type/:userInterestTypeId', null, {
        save: {
          method: 'POST',
          isArray: true
        }
      })
    }
  }

  angular.module('guide.factories')
    .factory('UserInterestTypeFactory', UserInterestTypeFactory);
})();
