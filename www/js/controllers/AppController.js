(function () {

  'use strict';

  function AppController($scope, $state, $ionicHistory, FacebookFactory, WikitudeFactory) {
    $scope.openAR = function () {
      console.log('opening AR...');
      var lastView = $ionicHistory.currentView().stateName;
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      WikitudeFactory.isDeviceSupported();
      $state.go(lastView);
    };

    $scope.checkStatus = function () {
      FacebookFactory.checkStatus('tab.account', 'tab.loginInAccount');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      console.log("Entra a probar");
    };
  }

  angular.module('guide.controllers')
    .controller('AppController', AppController);
})();
