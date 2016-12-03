(function () {

  'use strict';

  function MapController($scope, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicModal, $cordovaLaunchNavigator,
                         $interval, $cordovaInAppBrowser,
                         NgMap, UserFactory, PointOfInterestFactory, InterestTypeFactory, WikitudeFactory, MapsKey) {

    var options = {
      timeout: 15000,
      enableHighAccuracy: true,
      maximumAge: 2000
    };

    $scope.mapsKey = 'https://maps.googleapis.com/maps/api/js?key=' + MapsKey;

    $scope.markers = [];
    $scope.interests = InterestTypeFactory.factory.query();
    $scope.interest = {};
    $scope.currentPosition = {};

    $scope.$on('$ionicView.enter', function () {
      updatePosition();
      var image = UserFactory.getUser() ? 'http://graph.facebook.com/' + UserFactory.getUser().facebookId + '/picture?type=small'
        : 'img/default-profile.jpg';
      $scope.currentPosition.marker = image;
    });

    var getLocation = function (position) {
      return new Promise(function (resolve, reject) {
        $scope.currentPosition.position = position;
        resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      });
    };

    var locationFound = function (position) {
      NgMap.getMap('map').then(function (map) {
        $scope.map = map;
        getLocation(position).then(function () {
          findPois(null, null);
        });
      });
    };

    var locationNotFound = function (error) {
      //TODO: cambiar toast
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'No se pudo obtener la ubicación'
      });
      alertPopup.then(function (res) {
        console.log('Cerro el popup');
      });
      console.log('No se pudo obtener la ubicación: ' + error.message);
    };

    // var watch = $cordovaGeolocation.watchPosition(options);
    // watch.then(null, locationNotFound, locationFound);

    var updatePosition = function () {
      //TODO: verificar si tiene permiso de gps y habilitado el gps
      $cordovaGeolocation.getCurrentPosition(options).then(locationFound, locationNotFound);
    };
    $interval(updatePosition, 120000);

    $scope.centerOnCurrentPosition = function () {
      $ionicLoading.show({
        template: 'Obteniendo ubicación actual...',
        noBackdrop: true
      });
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        getLocation(position).then(function (myLatLng) {
          $scope.map.setCenter(myLatLng);
          $ionicLoading.hide();
        });
      }, locationNotFound);
    };

    var findPois = function (interest, subInterest) {
      return new Promise(function (resolve, reject) {
        var user = UserFactory.getUser();
        var userId = user ? user.id : null;
        PointOfInterestFactory.getPointsOfInterest(userId, $scope.currentPosition.position.coords.latitude,
          $scope.currentPosition.position.coords.longitude, interest, subInterest)
          .then(function (data) {
            if (user) {
              UserFactory.factory.get({id: UserFactory.getUser().id}, function (user) {
                UserFactory.setUser(user);
              });
            }
            $scope.markers = [];
            for (var i = 0; i < data.length; i++) {
              $scope.markers.push(createMarker(data[i]));
            }
            WikitudeFactory.pois = $scope.markers;
            resolve('Pois resolved');
          });
      });
    };

    $scope.changeInterest = function (interest) {
      findPois(interest, null);
    };

    var createMarker = function (place) {
      var marker = place;
      marker.animation = google.maps.Animation.DROP;
      return marker;
    };

    /**
     * Modal
     */
    $ionicModal.fromTemplateUrl('templates/details.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function (marker) {
      $scope.selectedPoi = marker;
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.launchNavigator = function () {
      $cordovaLaunchNavigator.navigate([$scope.selectedPoi.latitude, $scope.selectedPoi.longitude]);
    };

    $scope.openBrowser = function (placeId) {
      $cordovaInAppBrowser.open('foursquare.com/v/' + placeId, '_system', 'location=yes');
    };
  }

  angular.module('guide.controllers')
    .controller('MapController', MapController);
})();
