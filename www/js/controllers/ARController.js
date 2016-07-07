(function () {

  'use strict';

  function ARController($ionicHistory, $state, $scope, WikitudeFactory) {
    var openAR = function () {
      console.log('opening AR...');
      WikitudeFactory.isDeviceSupported();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go($ionicHistory.backView().stateName);
    };

    $scope.$on('$ionicView.enter', function () {
      openAR();
    });
  }

  angular.module('guide.controllers')
    .controller('ARController', ARController);
})();
