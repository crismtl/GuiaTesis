(function () {

  'use strict';

  function SessionFactory($resource, ApiUrl) {
    var obj = {
      setSession: function (session) {
        window.localStorage.session = JSON.stringify(session);
      },

      getSession: function () {
        return JSON.parse(window.localStorage.session || '{}');
      },

      createSession: function (userId) {
        obj.factory.save({
          time: new Date().getTime(),
          userId: userId
        }, function (response) {
          obj.setSession({
            id: response.id,
            time: response.date,
            userId: response.userId
          })
        });
      },

      factory: $resource(ApiUrl + '/session/:sessionId', {
          sessionId: '@sessionId'
        },
        {
          buscarPorFacebookId: {
            url: ApiUrl + '/session/facebook/:facebookId',
            method: 'GET',
            //params: {
            //    sesionId: '@sesionId'
            //}
            isArray: true
          }
        })
    };
    return obj;
  }

  angular.module('guide.factories')
    .factory('SessionFactory', SessionFactory);
})();
