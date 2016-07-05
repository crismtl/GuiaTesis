(function () {

  'use strict';

  function AccountCheckController($ionicHistory, FacebookFactory) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var checkStatus = function () {
      FacebookFactory.checkStatus('tab.account', 'tab.loginInAccount');
    };

    checkStatus();
  }

  angular.module('guide.controllers')
    .controller('AccountCheckController', AccountCheckController);
})();
