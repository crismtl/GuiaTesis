(function() {

  'use strict';

  function AccountController($scope, $ionicHistory, UserFactory, InterestTypeFactory, UserInterestTypeFactory, FacebookFactory) {
    $scope.user = UserFactory.getUser();
    $scope.user.img = 'http://graph.facebook.com/' + $scope.user.facebookId + '/picture?type=large';
    $scope.birthday = formatDate($scope.user.birthday);
    $scope.myInterest = getMyInterest($scope.user.userInterestTypes).interestType;
    console.log('$scope.user', $scope.user);

    $scope.interests = InterestTypeFactory.factory.query();

    $scope.changeInterest = function(interest) {
      UserInterestTypeFactory.factory.save({
        userId: UserFactory.getUser().id,
        interestType: interest
      }, function(success) {
        var user = UserFactory.getUser();
        user.userInterestTypes = success;
        UserFactory.setUser(user);
        $scope.myInterest = getMyInterest(success).interestType;
      });
    };

    $scope.logout = function () {
      facebookConnectPlugin.logout();
      UserFactory.setUser(null);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      FacebookFactory.checkStatus('tab.account', 'tab.loginInAccount');
    }
  }

  function getMyInterest(interestsArray) {
    var userInterest = {};
    for(var i = 0; i<interestsArray.length; i++){
      if (interestsArray[i].priority == true) {
        userInterest = interestsArray[i];
        break;
      }
    }
    return userInterest;
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
