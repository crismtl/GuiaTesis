(function () {

  'use strict';

  function PointOfInterestFactory($http, ApiUrl) {
    return {
      getPointsOfInterest: function (userId, latitude,
                                     longitude, type, subType) {
        var url = ApiUrl + '/poi?latitude=' + latitude +
          '&longitude=' + longitude + '&';
        if (userId) {
          url += 'userId=' + userId + '&';
        }
        if (type) {
          url += 'type=' + type.id + '&';
        }
        if (subType) {
          url += 'subType=' + subType.id + "&";
        }
        var promise = $http.get(url).then(function (response) {
          return response.data;
        });
        return promise;
      }

    }
  }

  angular.module('guide.factories')
    .factory('PointOfInterestFactory', PointOfInterestFactory);
})();
