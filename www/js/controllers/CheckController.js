(function () {

  'use strict';

  function CheckController($state, UserFactory) {
    // facebookConnectPlugin.getLoginStatus(function (success) {
    //   if (success.status === 'connected') {
    //    
    //     console.log('getLoginStatus', success.status);
    //   }
    // });


    if ($state.current.name == 'tab.interest') {
      if (UserFactory.getUser()) {
        console.log('Entraaaaaaaaaa!!!');
        $state.go('tab.map');
      } else {
        console.log('Entraaaaaaaaaa!!! 2');
        $state.go('tab.login');
      }
    }
  }

  angular.module('guide.controllers')
    .controller('CheckController', CheckController);
})();
