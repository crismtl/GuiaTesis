(function() {
  'use strict';
  var controllers = {
    MODULE: 'guide.controllers',
    dependencies: [
      // 'ngCordova'
      'ngMap'
      //'guide.services',
      //'guide.factories'
    ]
  };
  angular.module(controllers.MODULE, controllers.dependencies);
})();
