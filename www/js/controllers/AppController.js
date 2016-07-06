(function() {

  'use strict';

  function AppController($scope, WikitudeFactory) {
    $scope.openAR = function() {
      console.log('opening AR...');
      WikitudeFactory.isDeviceSupported();
    }
  }

  angular.module('guide.controllers')
    .controller('AppController', AppController);
})();
