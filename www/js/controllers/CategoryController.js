(function() {

  'use strict';

  function CategoryController($scope, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicModal, $cordovaDeviceOrientation,
    NgMap, UserFactory, PathFactory, PointOfInterestFactory, InterestTypeFactory) {

    var options = {
        timeout: 15000,
        enableHighAccuracy: true
      },
      mapOptions = {
        zoom: 16,
        streetViewControl: false,
        mapTypeControl: false
      },
      compassOptions = {
        frequency: 60000
      },
      currentPos,
      pointsOfInterest;

    $scope.markers = [];
    $scope.interests = InterestTypeFactory.factory.query();
    $scope.interest = '';

    var getLocation = function(position) {
      return new Promise(function(resolve, reject) {
        console.log('Set currentPosition');
        currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        $scope.currentPos = currentPos;
        $scope.map.setCenter(currentPos);
        $scope.currentPos.marker = 'http://graph.facebook.com/' + UserFactory.getUser().facebookId + '/picture?type=small';

        resolve('Ubicacion actualizada');
      });
    };

    var locationFound = function(position) {
      NgMap.getMap().then(function(map) {
        mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
        map.setOptions(mapOptions);
        $scope.map = map;
        getLocation(position).then(function() {
          console.log('user', UserFactory.getUser().facebookId);
        }, locationFound);
        $scope.findPois();
      });
    };

    var locationNotFound = function(error) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'No se pudo obtener la ubicación'
      });
      alertPopup.then(function(res) {
        console.log('Cerro el popup');
      });
      console.log('No se pudo obtener la ubicación: ' + error.message);
    };

    $cordovaGeolocation.getCurrentPosition(options).then(locationFound, locationNotFound);

    var watch = $cordovaDeviceOrientation.watchHeading(compassOptions).then(null,
      function(error) {},
      function(result) {
        console.log(result);
        console.log('Ubicación:', currentPos);
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
          getLocation(position).then(function() {
            console.log('Nueva Ubicación:', currentPos);
            //TODO: establecer el id de la sesion
            var path = PathFactory.getPositionFromCoords(currentPos, result.magneticHeading, null);
            console.log('path', path);
            PathFactory.factory.save(path);
          });
        }, locationNotFound);
      });

    //watch.clearWatch();

    $scope.centerOnCurrentPosition = function() {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Obteniendo ubicación actual...',
        showBackdrop: false
      });

      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        getLocation(position).then(function() {
          //TODO: establecer el id de la sesion
          $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            var path = PathFactory.getPositionFromCoords(currentPos, result.magneticHeading, null);
            console.log('path en center', path);
            PathFactory.factory.save(path);
            $scope.loading.hide();
          }, function(err) {});
        });
      }, locationNotFound);
    };

    $scope.findPois = function(interests) {
      var types = [],
        typesText;
      if (interests) {
        for (var i = 0; i < interests.length; i++) {
          types.push(interests.nameEn);
        }
        typesText = types.join('|');
      }
      PointOfInterestFactory.getFirst(UserFactory.getUser().id, currentPos.lat(), currentPos.lng(), typesText)
        .then(function(data) {
          $scope.markers = [];
          pointsOfInterest = data;
          console.log('pointsOfInterest', pointsOfInterest);
          for (i = 0; i < pointsOfInterest.length; i++) {
            var place = pointsOfInterest[i];
            // if (i < 2) {
            //   app.pois[i] = {
            //     'id': place.id,
            //     'latitude': place.latitude,
            //     'longitude': place.longitude,
            //     'altitude': 100,
            //     'description': place.description,
            //     'name': place.name,
            //     'priority': i
            //   }
            // }
            $scope.markers.push(createMarker(place));
          }
          console.log('$scope.markers', $scope.markers);
        });
    };

    function createMarker(place) {
      var marker = {
        name: place.name,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        animation: google.maps.Animation.DROP,
        icon: 'img/' + place.icon,
        types: place.types
      };
      return marker;
    }

    /**
     * Modal
     */
    $ionicModal.fromTemplateUrl('templates/interest.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function(marker) {
      $scope.selectedPoi = {
        name: marker.name,
        description: marker.description
      };
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  }

  angular.module('guide.controllers')
    .controller('CategoryController', CategoryController);
})();
