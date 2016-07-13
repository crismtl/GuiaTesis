(function() {

  'use strict';

  function AccountController($scope, UserFactory, InterestTypeFactory, UserInterestTypeFactory) {
    $scope.user = UserFactory.getUser();
    $scope.user.img = 'http://graph.facebook.com/' + $scope.user.facebookId + '/picture?type=large';
    $scope.birthday = formatDate($scope.user.birthday);
    $scope.myInterest = getMyInterest($scope.user.userInterestTypes);
    console.log('$scope.user', $scope.user);

    $scope.interests = InterestTypeFactory.factory.query();
    $scope.interest = {};

    $scope.changeInterest = function(interest) {
      $scope.myInterest = interest;
      UserInterestTypeFactory.factory.save({
        userId: UserFactory.getUser().id,
        interestType: interest
      }, function(success) {
        console.log("se cambio el interes", success);
        var user = UserFactory.getUser();
        user.userInterestTypes = success;
        UserFactory.setUser(user);
        $scope.user = UserFactory.getUser();
      });
    };
  }

  function getMyInterest(interestsArray) {
    var interest = {};
    angular.forEach(interestsArray, function(value, key) {
      if (value.priority === true) {
        interest = value.interestType;
      }
    });
    return interest;
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
