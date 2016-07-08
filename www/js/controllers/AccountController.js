(function() {

  'use strict';

  function AccountController($scope, UserFactory) {
    $scope.user = UserFactory.getUser();
    $scope.user.img = 'http://graph.facebook.com/' + $scope.user.facebookId + '/picture?type=large';
    $scope.birthday = formatDate($scope.user.birthday);
    console.log('$scope.user', $scope.user);
  }

  function formatDate(timestamp) {
    var a = new Date(timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + '/' + month + '/' + year;
    return time;
  }

  angular.module('guide.controllers')
    .controller('AccountController', AccountController);
})();
