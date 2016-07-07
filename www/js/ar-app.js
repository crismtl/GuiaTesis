(function () {

	'use strict';

	var guide = {
		MODULE: 'ar',
		dependencies: [
			'ionic',
			'angular.panels'
		]
	};

	angular.module(guide.MODULE, guide.dependencies)

		.config(['panelsProvider', function (panelsProvider) {

			panelsProvider
				.add({
					id: 'info',
					position: 'right',
					size: '70%',
					templateUrl: 'templates/info-panel.html',
					controller: 'infoCtrl'
				});
		}])
		.controller('arCtrl', function ($scope, $ionicPopup, panels) {

			$scope.showBar = false;

			$scope.details = function (marker) {
				$scope.showBar = true;
				$scope.marker = marker.poiData;
				$scope.markerObject = marker;
				$scope.marker.distanceToUserValue = marker.distanceToUserValue;
				$scope.$apply();
			};

			$scope.hideFooter = function () {
				$scope.showBar = false;
				$scope.$apply();
			};

			$scope.openPanel = function () {
				$scope.$broadcast('info', {marker: $scope.marker});
			};

			$scope.updateDistance = function (marker) {
				$scope.marker.distanceToUserValue = marker.distanceToUserValue;
				$scope.$apply();
			};

			var locationChanged = function (lat, lon, alt, acc) {
				for (var i = 0; i < World.markerList.length; i++) {
					var marker = World.markerList[i];
					marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
					var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + ' km') : (Math.round(marker.distanceToUser) + ' m');
					marker.distanceLabel.text = distanceToUserValue;
					if (marker.distanceToUser <= 5 && !marker.poiData.rated) {
						$scope.marker = marker.poiData;
						$scope.marker.rated = true;
						var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=visited';
						document.location = architectURL;
						$scope.showPopup();
					}
				}
			};

			// $scope.showPopup = function () {
      // 	$scope.rating = {};
      // 	var rating = $ionicPopup.show({
      // 		template: '<rating style="text-align: center" ng-model="rating.value" max="5"></rating>',
      // 		title: 'Rate the place',
      // 		// subTitle: 'Please use normal things',
      // 		scope: $scope,
      // 		buttons: [
      // 			{text: 'Cancel'},
      // 			{
      // 				text: '<b>Rate</b>',
      // 				type: 'button-positive',
      // 				onTap: function (e) {
      // 					return true;
      // 				}
      // 			}
      // 		]
      // 	});
      //
      // 	rating.then(function (result) {
      // 		console.log('Tapped', result);
      // 		var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=rating&value=' + $scope.rating.value;
      // 		document.location = architectURL;
      // 	}, function (error) {
      // 		console.log('error', error);
      // 	}, function (popup) {
      // 		popup.close();
      // 	});
      // };

			//TODO: revisar xq esta comentado
			// AR.context.onLocationChanged = locationChanged;
		})
		.controller('infoCtrl', function ($scope, panels) {
			$scope.$on('info', function (event, args) {
				$scope.marker = args.marker;
				panels.open("info");
			});

			$scope.openBrowser = function () {
				var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=openBrowser';
				document.location = architectURL;
			};

			$scope.openMaps = function () {
				var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=openMaps';
				document.location = architectURL;
			};

			$scope.launchNavigator = function () {
				var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=launchNavigator';
				document.location = architectURL;
			};

			$scope.closeWikitudePlugin = function () {
				var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=closeWikitudePlugin';
				document.location = architectURL;
			};
		});
})();
