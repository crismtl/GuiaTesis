// implementation of AR-Experience (aka "World")
var World = {
	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	/*
	 Have a look at the native code to get a better understanding of how data can be injected to JavaScript.
	 Besides loading data from assets it is also possible to load data from a database, or to create it in native code. Use the platform common way to create JSON Objects of your data and use native 'architectView.callJavaScript()' to pass them to the ARchitect World's JavaScript.
	 'World.loadPoisFromJsonData' is called directly in native code to pass over the poiData JSON, which then creates the AR experience.
	 */
	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
		// show radar
		Radar.show();

		// empty list of visible markers
		World.markerList = [];

		// start loading marker assets
		World.markerDrawable_idle = new AR.ImageResource("img/marker_idle.png");
		World.markerDrawable_selected = new AR.ImageResource("img/marker_selected.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("img/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = poiData[currentPlaceNr];
			singlePoi.rated = false;
			World.markerList.push(new Marker(singlePoi));
		}

		// updates distance information of all placemarks
		World.updateDistanceToUserValues();
	},

	// sets/updates distances of all makers so they are available way faster than calling (time-consuming) distanceToUser() method all the time
	updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
		for (var i = 0; i < World.markerList.length; i++) {
			World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
		}
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {
		World.currentMarker.distanceToUser = World.currentMarker.markerObject.locations[0].distanceToUser();
		World.currentMarker.distanceToUserValue = World.distanceToUser(World.currentMarker);
		angular.element(document.getElementById('page-ar')).scope().updateDistance(World.currentMarker);
		// for (var i = 0; i < World.markerList.length; i++) {
		// 	var marker = World.markerList[i];
		// 	marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
		// 	var distanceToUserValue = distanceToUserValue(marker);
		// 	marker.distanceLabel.text = distanceToUserValue;
		// if (marker.distanceToUser <= 5) {

		// var architectURL = 'architectsdk://position=' + $scope.marker.position + '&action=openBrowser';
		// document.location = architectURL;
		// }
		// }
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
		World.currentMarker = marker;
		World.currentMarker.distanceToUser = World.currentMarker.markerObject.locations[0].distanceToUser();
		World.currentMarker.distanceToUserValue = World.distanceToUser(World.currentMarker);
		angular.element(document.getElementById('page-ar')).scope().details(World.currentMarker);
		// update panel values
		// $("#poi-detail-title").html(marker.poiData.title);
		// $("#poi-detail-description").html(marker.poiData.description);

		// var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");

		// $("#poi-detail-distance").html(distanceToUserValue);

		// show panel
		// $("#panel-poidetail").panel("open", 123);

		// $(".ui-panel-dismiss").unbind("mousedown");

		// $("#panel-poidetail").on("panelbeforeclose", function (event, ui) {
		// 	World.currentMarker.setDeselected(World.currentMarker);
		// });
	},

	distanceToUser: function distanceToUserFn(marker) {
		var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");
		return distanceToUserValue;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		// you may handle clicks on empty AR space too
		World.currentMarker.setDeselected(World.currentMarker);
		angular.element(document.getElementById('page-ar')).scope().hideFooter();
	},

	// returns distance in meters of placemark with maxdistance * 1.1
	getMaxDistance: function getMaxDistanceFn() {

		// sort palces by distance so the first entry is the one with the maximum distance
		World.markerList.sort(World.sortByDistanceSortingDescending);

		// use distanceToUser to get max-distance
		var maxDistanceMeters = World.markerList[0].distanceToUser;

		// return maximum distance times some factor >1.0 so ther is some room left and small movements of user don't cause places far away to disappear
		return maxDistanceMeters * 1.1;
	},

	// helper to sort places by distance
	sortByDistanceSorting: function (a, b) {
		return a.distanceToUser - b.distanceToUser;
	},

	// helper to sort places by distance, descending
	sortByDistanceSortingDescending: function (a, b) {
		return b.distanceToUser - a.distanceToUser;
	}

};

/* forward locationChanges to custom function */
AR.context.onLocationChanged = World.locationChanged;

/* forward clicks in empty area to World */
AR.context.onScreenClick = World.onScreenClick;
