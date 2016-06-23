(function() {

  'use strict';
  var factories = {
    MODULE: 'guide.factories',
    dependencies: []
  };
  angular.module(factories.MODULE, factories.dependencies)
    .constant('ApiUrl', 'http://rs-guiaquito.rhcloud.com/guiaquito/api');
    //.constant('ApiUrl', 'http://localhost:8100/ApiUrl')

})();
