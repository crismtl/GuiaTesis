(function() {

  'use strict';

  function PathFactory($resource, ApiUrl) {
    return {
      factory: $resource(ApiUrl + '/path/:pathId', {
        pathId: '@pathId'
      }),
      getPositionFromCoords: function(position, orientation, session) {
        var path = {
          latitude: position.lat(),
          longitude: position.lng(),
          orientation: orientation,
          date: new Date().getTime(),
          session: session
        };
        return path;
      }
    }
  }

  angular.module('guide.factories')
    .factory('PathFactory', PathFactory);
})();
