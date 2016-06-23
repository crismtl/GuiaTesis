(function() {
  'use strict';
  var controllers = {
    MODULE: 'guide.controllers',
    dependencies: [
      // 'ngCordova'
      // 'ngMap'
      //'guide.services',
      //'guide.factories'
    ]
  };
  angular.module(controllers.MODULE, controllers.dependencies)
    .constant('MapsKey', 'AIzaSyDZsV8jSy9orFRiY-wXLuP_AcNlRoTqe_c');
})();
