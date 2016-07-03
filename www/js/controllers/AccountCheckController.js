(function () {

  'use strict';

  function AccountCheckController($state, $ionicHistory, UserFactory, FacebookFactory) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    facebookConnectPlugin.getLoginStatus(function (success) {
      if (success.status === 'connected') {
        console.log('getLoginStatus', success.status);
        FacebookFactory.getFacebookProfileInfo(success.authResponse)
          .then(function (profileInfo) {
            var user = FacebookFactory.convertUser(profileInfo, success.authResponse.accessToken);
            // UserFactory.factory.update(user, function (response) {
            //   UserFactory.setUser(response);
            // });
            $state.go('tab.account');
          }, function (fail) {
            console.log('profile info fail', fail);
          });
      }
      else {
        $state.go('tab.loginInAccount');
      }
    });
  }

  angular.module('guide.controllers')
    .controller('AccountCheckController', AccountCheckController);
})();
