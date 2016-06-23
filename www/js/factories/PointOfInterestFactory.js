(function() {

  'use strict';

  function PointOfInterestFactory($http, ApiUrl) {
    return {
      getFirst: function(userId, latitude,
        longitude, types) {
        var url;
        if (userId) {
          url = ApiUrl + '/poi/' + userId + '?latitude=' + latitude +
            '&longitude=' + longitude + '&types=' + types;
        } else {
          url = ApiUrl + '/poi/?latitude=' + latitude +
            '&longitude=' + longitude + '&types=' + types;
        }
        var promise = $http.get(url).then(function(response) {
          return response.data;
        });
        return promise;
      }

    }
  }

  angular.module('guide.factories')
    .factory('PointOfInterestFactory', PointOfInterestFactory);
})();
