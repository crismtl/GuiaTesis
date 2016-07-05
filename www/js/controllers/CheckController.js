(function () {

  'use strict';

  function CheckController($ionicHistory, FacebookFactory) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var checkStatus = function () {
      FacebookFactory.checkStatus('tab.map', 'tab.login');
    };

    checkStatus();
  }

  angular.module('guide.controllers')
    .controller('CheckController', CheckController);
})();
