(function() {

  'use strict';

  function PathFactory($resource, ApiUrl) {
    return {
      factory: $resource(ApiUrl + '/path/:pathId', {
        pathId: '@pathId'
      }),
      getPositionFromCoords: function(position, orientation, session) {
        var path = {
          latitude: position.coords.latitude,
          longitude: position.coords.latitude,
          orientation: orientation,
          time: new Date().getTime(),
          sessionId: session
        };
        return path;
      }
    }
  }

  angular.module('guide.factories')
    .factory('PathFactory', PathFactory);
})();
