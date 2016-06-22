(function() {

  'use strict';

  function UtilsFactory() {
    return {
      getDateFromFacebook: function(date) {
        var current = date.split('/');
        return new Date(current[2], current[0] - 1, current[1]);
      }
    }
  }

  angular.module('guide.factories')
    .factory('UtilsFactory', UtilsFactory);
})();
