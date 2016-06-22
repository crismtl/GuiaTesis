(function() {

  'use strict';

  function CategoryController($scope, UserFactory) {
    $scope.user = UserFactory.getUser();
  }

  angular.module('guide.controllers')
    .controller('CategoryController', CategoryController);
})();
