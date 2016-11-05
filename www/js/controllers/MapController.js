(function () {

  'use strict';

  function MapController($scope, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicModal, $cordovaLaunchNavigator,
                         NgMap, UserFactory, PointOfInterestFactory, InterestTypeFactory, WikitudeFactory, MapsKey) {

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

    $scope.$on('$ionicView.enter', function () {
      //TODO: buscar la posicion
      if (currentPos) {
        findPois(null, null);
        var image = UserFactory.getUser() ? 'http://graph.facebook.com/' + UserFactory.getUser().facebookId + '/picture?type=small'
          : 'img/default-profile.jpg';
        $scope.currentPos.marker = image;
      }
    });

    var getLocation = function (position) {
      return new Promise(function (resolve, reject) {
        currentPos = position;
        $scope.currentPos = currentPos;
        //TODO: centrar mapa
        var image = UserFactory.getUser() ? 'http://graph.facebook.com/' + UserFactory.getUser().facebookId + '/picture?type=small'
          : 'img/default-profile.jpg';
        $scope.currentPos.marker = image;
        resolve('Location updated');
      });
    };

    var locationFound = function (position) {
      NgMap.getMap('categories').then(function (map) {
        getLocation(position).then(function () {
          findPois(null, null);
        });
      });
    };

    var locationNotFound = function (error) {
      //TODO: cambiar toast
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

    $scope.centerOnCurrentPosition = function () {
      $ionicLoading.show({
        template: 'Obteniendo ubicación actual...',
        noBackdrop: true
      });

      //Basta con el watch?
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        getLocation(position).then(function () {
          $ionicLoading.hide();
        });
      }, locationNotFound);
    };

    var findPois = function (interest, subInterest) {
      return new Promise(function (resolve, reject) {
        console.log('findpois user', UserFactory.getUser());
        var user = UserFactory.getUser();
        var userId = user ? user.id : null;
        PointOfInterestFactory.getPointsOfInterest(userId, currentPos.coords.latitude, currentPos.coords.longitude, interest, subInterest)
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
      // $scope.interest = interest;
      // UserInterestTypeFactory.factory.save({
      //   userId: UserFactory.getUser().id,
      //   interestType: $scope.interest
      // }, function (success) {
      findPois(interest, null);
      // });
    };

    var createMarker = function (place) {
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
  }

  angular.module('guide.controllers')
    .controller('MapController', MapController);
})();
