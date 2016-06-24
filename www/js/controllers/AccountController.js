(function() {

  'use strict';

  function AccountController($scope, UserFactory) {
    $scope.user = UserFactory.getUser();
    $scope.user.img = 'http://graph.facebook.com/' + $scope.user.facebookId + '/picture?type=large';
    console.log('$scope.user', $scope.user);
  }

  angular.module('guide.controllers')
    .controller('AccountController', AccountController);
})();
