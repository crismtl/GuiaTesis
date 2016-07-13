(function () {

  'use strict';

  function CheckController($scope, $ionicHistory, FacebookFactory) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var checkStatus = function () {
      FacebookFactory.checkStatus('tab.map', 'tab.login');
    };

    $scope.$on('$ionicView.enter', function () {
      checkStatus();
    });
  }

  angular.module('guide.controllers')
    .controller('CheckController', CheckController);
})();
