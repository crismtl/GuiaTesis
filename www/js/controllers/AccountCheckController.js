(function () {

  'use strict';

  function AccountCheckController($scope, $ionicHistory, FacebookFactory) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var checkStatus = function () {
      FacebookFactory.checkStatus('tab.account', 'tab.loginInAccount');
    };

    $scope.$on('$ionicView.enter', function () {
      checkStatus();
    });
  }

  angular.module('guide.controllers')
    .controller('AccountCheckController', AccountCheckController);
})();
