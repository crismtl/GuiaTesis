(function() {

  'use strict';

  function InterestController($scope, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicModal, $cordovaDeviceOrientation,
    NgMap, UserFactory, PathFactory, PointOfInterestFactory, InterestTypeFactory,
    SessionFactory, WikitudeFactory, MapsKey) {

    var options = {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 0
      },
      watchOptions = {
        frequency: 120000
      },
      currentPos;

    $scope.mapsKey = 'https://maps.googleapis.com/maps/api/js?key=' + MapsKey;

    $scope.markers = [];
    $scope.interests = InterestTypeFactory.factory.query();
    $scope.interest = {};

    $scope.$on('$ionicView.enter', function() {
      if (currentPos) {
        findPois(null, null);
      }
    });

    SessionFactory.createSession(UserFactory.getUser().id);

    var getLocation = function(position) {
      return new Promise(function(resolve, reject) {
        currentPos = position;
        $scope.currentPos = currentPos;
        //TODO: definir una imagen
        $scope.currentPos.marker = 'http://graph.facebook.com/' + UserFactory.getUser().facebookId + '/picture?type=small';
        resolve('Location updated');
      });
    };

    var locationFound = function(position) {
      NgMap.getMap('categories').then(function(map) {
        getLocation(position).then(function() {
          findPois(null, null);
        });
      });
    };

    var locationNotFound = function(error) {
      //TODO: cambiar toast
      // alert('No se pudo obtener la ubicación');
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

    //Se va a monitorear la posicion?
    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
      },
      function(position) {
        var path;
        $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
          path = PathFactory.getPositionFromCoords(position, result.magneticHeading, SessionFactory.getSession().id);
          PathFactory.factory.save(path);
        }, function(err) {
          path = PathFactory.getPositionFromCoords(position, null, SessionFactory.getSession().id);
          PathFactory.factory.save(path);
        });
      });

    //watch.clearWatch();

    $scope.centerOnCurrentPosition = function() {
      $scope.loading = $ionicLoading.show({
        template: 'Obteniendo ubicación actual...',
        noBackdrop: true
      });

      //Basta con el watch?
      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        getLocation(position).then(function() {
          $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            var path = PathFactory.getPositionFromCoords(currentPos, result.magneticHeading, SessionFactory.getSession().id);
            console.log(path);
            PathFactory.factory.save(path);
            $scope.loading.hide();
          }, function(err) {});
        });
      }, locationNotFound);
    };

    var findPois = function(interest, subInterest) {
      return new Promise(function(resolve, reject) {
        PointOfInterestFactory.getPointsOfInterest(UserFactory.getUser().id, currentPos.coords.latitude, currentPos.coords.longitude, interest, subInterest)
          .then(function(data) {
            $scope.markers = [];
            for (var i = 0; i < data.length; i++) {
              $scope.markers.push(createMarker(data[i]));
            }
            WikitudeFactory.pois = $scope.markers;
            resolve('Pois resolved');
          });
      });
    };

    $scope.changeInterest = function(interest) {
      $scope.interest = interest;
      // UserInterestTypeFactory.factory.save({
      //   userId: UserFactory.getUser().id,
      //   interestType: $scope.interest
      // }, function (success) {
      //   findPois($scope.interest, null);
      // });
    };

    var createMarker = function(place) {
      var marker = place;
      marker.animation = google.maps.Animation.DROP;
      return marker;
    };

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
      $scope.selectedPoi = marker;
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
    .controller('InterestController', InterestController);
})();
