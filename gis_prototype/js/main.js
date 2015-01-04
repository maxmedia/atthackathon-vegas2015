$(function() {
	document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
            tizen.application.getCurrentApplication().exit();
        }
    });
});

function showError(msg) {
	$("body > .error").text(msg);
}

var map = null,
	directions = null,
	currentSegment = -1;

require(["esri/map", "esri/geometry/Point", "esri/dijit/Directions", "esri/geometry/Extent", "esri/SpatialReference", "esri/urlUtils", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/graphic"], function(Map, Point, Directions, Extent, SpatialReference, urlUtils, ArcGISDynamicMapServiceLayer, Graphic) {
	var DEFAULT_SPATIAL_REF = new SpatialReference(4326);
	
	/*
	function positionToPoint(pos) {
		var c = pos.coords;
		return new Point(pos.coords.longitude, pos.coords.latitude);
	}
	
	function updateMapPosition(pos) {
		if(map) {
			map.centerAndZoom(positionToPoint(pos), 1.0);
		}
	}

	function geoError(err) {
		console.error("Geolocation Error (code " + err.code + "): " + err.message);
		showError(err.message);
	}
	*/

	function setupMap(stops) {
		var xMin = 180.0,
			yMin = 180.0,
			xMax = -180.0, 
			yMax = -180.0,
			mapOpts = { basemap: "gray", slider: false },
			directionsOpts = {
				stops: stops,
				alphabet: false,
				canModifyStops: false,
				centerAtSegmentStart: true,
				dragging: false,
				// fromSymbol: "",
				// stopSymbol: null,
				optimalRoute: false,
				// routeSymbol: null,
				// segmentSymbol: null,
				showClearButton: false,
				showMilesKilometersOption: false,
				showOptimalRouteOption: false,
				showPrintPage: false,
				showReturnToStartOption: false,
				showReverseStopsButton: false,
				showTrafficOption: false,
				traffic: false,
//				trafficLayer: null,
				trafficLayer: new ArcGISDynamicMapServiceLayer("http://traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer?token=WXX-BWdv0aSqB8Ew4bgbCG16WmJutZ86D4PSPPQoJXExhefVFbeydzUzAcsHLP9k3Sw6EQ2QM9ND-KjPZMmDGfLN5CoMtj5tZ1Uo2JjloyjZC5ZLuYWmJsRHQ-OvhmcuXMuyWF7_aoUiG8dfxLPRfQ.."),
				showTravelModesOption: false,
				geometryTaskUrl: "http://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer?token=WXX-BWdv0aSqB8Ew4bgbCG16WmJutZ86D4PSPPQoJXExhefVFbeydzUzAcsHLP9k3Sw6EQ2QM9ND-KjPZMmDGfLN5CoMtj5tZ1Uo2JjloyjZC5ZLuYWmJsRHQ-OvhmcuXMuyWF7_aoUiG8dfxLPRfQ..",
				routeTaskUrl: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World?token=WXX-BWdv0aSqB8Ew4bgbCG16WmJutZ86D4PSPPQoJXExhefVFbeydzUzAcsHLP9k3Sw6EQ2QM9ND-KjPZMmDGfLN5CoMtj5tZ1Uo2JjloyjZC5ZLuYWmJsRHQ-OvhmcuXMuyWF7_aoUiG8dfxLPRfQ.."
				// theme: ""
			}

		stops.forEach(function(point) {
			if(point.x < xMin) {
				xMin = point.x;
			}
			if(point.y < yMin) {
				yMin = point.y;
			}
			if(point.x > xMax) {
				xMax = point.x;
			}
			if(point.y > yMax) {
				yMax = point.y;
			}
		});

		mapOpts.extent = new Extent(xMin, yMin, xMax, yMax, DEFAULT_SPATIAL_REF);
		mapOpts.extent.expand(1.25);
		map = new Map("map", mapOpts);
		
		directionsOpts.map = map;
		directions = new Directions(directionsOpts, "map-directions");
		directions.toSymbol = directions.stopSymbol;
		directions.addStops(stops);
	}

	$(function() {
		var points = [];
		$.ajax({
			url: "https://api-m2x.att.com/v2/devices/21a91002619534c6094ba63dc3a7832a/streams/longitudes/values",
			dataType: "json",
			headers: {
				"X-M2X-KEY": "2323b7452691773da7904541bc6d6196"
			}
		}).done(function(data) {
			data.values.forEach(function(doc) {
				points.push(new Point(doc.value, 0, DEFAULT_SPATIAL_REF));
			});
			$.ajax({
				url: "https://api-m2x.att.com/v2/devices/21a91002619534c6094ba63dc3a7832a/streams/latitudes/values",
				dataType: "json",
				headers: {
					"X-M2X-KEY": "2323b7452691773da7904541bc6d6196"
				}
			}).done(function(data) {
				data.values.forEach(function(doc, i) {
					points[i].y = doc.value;
				});
				points = points.reverse();
				setupMap(points);
				directions.deactivate();
				directions.startup();
				directions.on('directions-finish', function() {
					setTimeout(function() {
						directions.highlightSegment(++currentSegment);
						directions.zoomToSegment(currentSegment);
						$('#map').on('click', '.esriPopup .contentPane', function(event) {
							directions.unhighlightSegment(currentSegment);
							directions.highlightSegment(++currentSegment);
							directions.zoomToSegment(currentSegment);
							event.preventDefault();
						});
					}, 2000);
				});
				directions.getDirections();
			});
		});
	});
});
