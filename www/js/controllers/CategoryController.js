(function () {

  'use strict';

  function CategoryController($scope, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicModal, $cordovaDeviceOrientation,
                              NgMap, UserFactory, PathFactory, PointOfInterestFactory, InterestTypeFactory,
                              SessionFactory, WikitudeFactory, MapsKey) {

    var options = {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 0
      },
      compassOptions = {
        frequency: 120000
      },
      currentPos,
      pointsOfInterest;

    $scope.mapsKey = 'https://maps.googleapis.com/maps/api/js?key=' + MapsKey;

    $scope.markers = [];
    $scope.interests = InterestTypeFactory.factory.query();
    $scope.interest = '';

    var getLocation = function (position) {
      return new Promise(function (resolve, reject) {
        currentPos = position;
        $scope.currentPos = currentPos;
        console.log("Entra");
        console.log($scope.currentPos);
        $scope.currentPos.marker = 'http://graph.facebook.com/' + UserFactory.getUser().facebookId + '/picture?type=small';
        resolve('Location updated');
      });
    };

    var locationFound = function (position) {
      NgMap.getMap('index').then(function (map) {
        getLocation(position).then(function () {
          console.log("Entra");
          findPois(null, null).then(function () {
            WikitudeFactory.isDeviceSupported();
          });
        });
      });
    };

    var locationNotFound = function (error) {
      //TODO: verificar si existe alguna solucion para la superposicion de alerts de ionic, sino usar alert js
      // alert('No se pudo obtener la ubicación');
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'No se pudo obtener la ubicación'
      });
      alertPopup.then(function (res) {
        console.log('Cerro el popup');
      });
      console.log('No se pudo obtener la ubicación: ' + error.message);
    };

    $cordovaGeolocation.getCurrentPosition(options).then(locationFound, locationNotFound);

    var watch = $cordovaDeviceOrientation.watchHeading(compassOptions).then(null,
      function (error) {
      },
      function (result) {
        console.log(result);
        console.log('Ubicación:', currentPos);
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
          getLocation(position).then(function () {
            console.log('Nueva Ubicación:', currentPos);
            var path = PathFactory.getPositionFromCoords(currentPos, result.magneticHeading, SessionFactory.getSession().id);
            console.log(path);
            PathFactory.factory.save(path);
          });
        }, locationNotFound);
      });

    //watch.clearWatch();

    $scope.centerOnCurrentPosition = function () {
      $scope.loading = $ionicLoading.show({
        content: 'Obteniendo ubicación actual...',
        showBackdrop: false
      });

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        getLocation(position).then(function () {
          $cordovaDeviceOrientation.getCurrentHeading().then(function (result) {
            var path = PathFactory.getPositionFromCoords(currentPos, result.magneticHeading, SessionFactory.getSession().id);
            console.log(path);
            PathFactory.factory.save(path);
            $scope.loading.hide();
          }, function (err) {
          });
        });
      }, locationNotFound);
    };

    var findPois = function (interest, subInterest) {
      return new Promise(function (resolve, reject) {
        PointOfInterestFactory.getPointsOfInterest(UserFactory.getUser().id, currentPos.coords.latitude, currentPos.coords.longitude, interest, subInterest)
          .then(function (data) {
            $scope.markers = [];
            for (var i = 0; i < data.length; i++) {
              // data[i].position = i;
              $scope.markers.push(createMarker(data[i]));
            }
            WikitudeFactory.pois = $scope.markers;
            resolve('Pois resolved');
          });
      });
    };

    var createMarker = function (place) {
      var marker = place;
      marker.animation = google.maps.Animation.DROP;
      // marker.icon = 'img/' + place.icon;
      return marker;
    };

    /**
     * Modal
     */
    $ionicModal.fromTemplateUrl('templates/interest.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function (marker) {
      $scope.selectedPoi = {
        name: marker.name,
        description: marker.description
      };
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
  }

  angular.module('guide.controllers')
    .controller('CategoryController', CategoryController);
})();
