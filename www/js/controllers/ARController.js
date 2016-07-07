(function () {

  'use strict';

  function ARController($ionicHistory, WikitudeFactory) {
    var openAR = function () {
      console.log('opening AR...');
      WikitudeFactory.isDeviceSupported();
      //TODO: navegar entre tabs, cada tab tiene un historial propio, vero como se puede hacer
      $ionicHistory.goBack();
    };

    openAR();
  }

  angular.module('guide.controllers')
    .controller('ARController', ARController);
})();
