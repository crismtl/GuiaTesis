(function() {

  'use strict';

  function AccountController($scope, UserFactory) {
    $scope.user = UserFactory.getUser();
  }

  angular.module('guide.controllers')
    .controller('AccountController', AccountController);
})();
