(function () {

  'use strict';

  function WikitudeFactory() {
    var wikitudePlugin = {

      plugin: {},

      params: {
        path: 'www/ar.html',
        requiredFeatures: [
          "geo"
        ],
        startupConfiguration: {
          "camera_position": "back"
        }
      },

      getPlugin: function () {
        return wikitudePlugin.plugin;
      },

      pois: {},

      //Verifica si el dispositivo es soportado y llama a la experiencia de realidad aumentada
      isDeviceSupported: function () {
        wikitudePlugin.getPlugin().isDeviceSupported(wikitudePlugin.onDeviceSupported, wikitudePlugin.onDeviceNotSupported, wikitudePlugin.params.requiredFeatures);
      },

      onDeviceSupported: function () {
        wikitudePlugin.getPlugin().setOnUrlInvokeCallback(wikitudePlugin.onURLInvoked);
        for (var i = 0; i < wikitudePlugin.pois.length; i++) {
          wikitudePlugin.pois[i].position = i;
        }
        wikitudePlugin.getPlugin().loadARchitectWorld(wikitudePlugin.onARExperienceLoadedSuccessful,
          wikitudePlugin.onARExperienceLoadError,
          wikitudePlugin.params.path, wikitudePlugin.params.requiredFeatures, wikitudePlugin.params.startupConfiguration
        );
      },
      onDeviceNotSupported: function (errorMessage) {
        alert(errorMessage);
      },

      //Esta funcion sirve para comunicar la app con wikitude
      onARExperienceLoadedSuccessful: function (loadedURL) {
        wikitudePlugin.getPlugin().callJavaScript("World.loadPoisFromJsonData(" + JSON.stringify(wikitudePlugin.pois) + ");");
      },

      onARExperienceLoadError: function (errorMessage) {
        alert('Loading AR web view failed: ' + errorMessage);
      },

      onURLInvoked: function (url) {
        var position = parseInt(url.substring(24, 25));
        var action = url.substring(33);
        // console.log(action.substring(0, 6));
        if ('openBrowser' == action) {
          wikitudePlugin.getPlugin().close();
          cordova.InAppBrowser.open('https://foursquare.com/v/' + wikitudePlugin.pois[position].placeId, '_system');
        } else if ('launchNavigator' == action) {
          wikitudePlugin.getPlugin().close();
          launchnavigator.navigate([wikitudePlugin.pois[position].latitude, wikitudePlugin.pois[position].longitude]);
        } else if ('closeWikitudePlugin' == action) {
          wikitudePlugin.getPlugin().close();
        }
      }
    };

    return wikitudePlugin;
  }

  angular.module('guide.factories')
    .factory('WikitudeFactory', WikitudeFactory);
})();
