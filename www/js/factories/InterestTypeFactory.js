(function() {
  'use strict';

  function InterestTypeFactory($resource, ApiUrl) {
    return {
      factory: $resource(ApiUrl + '/interest-type/:interestTypeId', {
        interestTypeId: '@interestTypeId'
      })
    }
  }

  angular.module('guide.factories')
    .factory('InterestTypeFactory', InterestTypeFactory);

})();
