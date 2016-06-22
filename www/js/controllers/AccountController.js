(function() {

  'use strict';

  function AccountController($scope, $state, $ionicModal, $timeout, UserFactory) {
    // var facebookSignIn = function() {
    //   facebookConnectPlugin.getLoginStatus(function(success) {
    //     console.log(success);
    //     if (success.status === 'connected') {
    //       $state.go('app.map');
    //     } else {
    //       $state.go('login');
    //     }
    //   });
    // };
    // $timeout(facebookSignIn, 500);

    // var login = function() {
    //   $ionicModal.fromTemplateUrl('templates/login.html', {
    //     scope: $scope
    //   }).then(function(modal) {
    //     $scope.modal = modal;
    //   });
    //   $scope.modal.show();
    // }

    // if (UserFactory.getUser().userId) {
    //   console.log('esta logueado', UserFactory.getUser().userId);
    //   $state.go('tab.account');
    // } else {
    //   console.log('noesta logueado');
    //   // login();
    //   $ionicModal.fromTemplateUrl('templates/login.html', {
    //     scope: $scope
    //   }).then(function(modal) {
    //     $scope.modal = modal;
    //     $scope.modal.show();
    //   });
    // }

    $scope.skipLogIn = function() {
      // $scope.modal.hide();
      $state.go('tab.category');
    };
  }

  angular.module('guide.controllers')
    .controller('AccountController', AccountController);
})();
