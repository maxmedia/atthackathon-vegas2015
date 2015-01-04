$(window).load(function(){
	// document.addEventListener('tizenhwkey', function(e) {
 //        if(e.keyName === "back")
 //            tizen.application.getCurrentApplication().exit();
 //    });

	$('.link').on('click',function(){
		var link = $(this).data().link;
		$('#'+link).addClass('active').siblings().removeClass('active');
	});


	$('.view').bind('swipeup', function(event){
		console.log('lol');
	});
	$('.view').doubleTap(function(event){
		console.log('doubletap');
	});

	$('#explore-journey').bind('swipeleft', function(event){
		console.log('swipeleft');

			$('.audio-preview').fadeOut('fast');
			$('.soundbite1').fadeIn('fast');
			$('.soundbite1').play();
	});

	$('#explore-journey5').bind('swipeleft', function(event){
		console.log('swipeleft');

			$('.audio-preview2').fadeOut('fast');
			$('.soundbite2').fadeIn('fast');

	});
	$('.play-me1').on('click', function(){
		$('.soundbite1').play();
	})
	$('.play-me2').on('click', function(){
		$('.video-file').play();
	})
	$('.play-me3').on('click', function(){
		$('.soundbite2').play();
	})


	$('#explore-journey3').bind('swipeleft', function(event){
		console.log('swipeleft');

			$('.video-preview').fadeOut('fast');
			$('.video').fadeIn('fast');
			$('.video').play();
	});

	$('#explore-journey4').bind('swipeleft', function(event){
		console.log('swiperight');
		if($('.gallery_image.active').next().hasClass('gallery_image')){
			$('.gallery_image.active').fadeOut('fast');
			$('.gallery_image.active').next().fadeIn('fast');
			$('.gallery_image.active').removeClass('active').next().addClass('active');
		}
	});
	$('#explore-journey4').bind('swiperight', function(event){
		console.log('swipeleft');
		if($('.gallery_image.active').prev().hasClass('gallery_image')){
			$('.gallery_image.active').fadeOut('fast');
			$('.gallery_image.active').prev().fadeIn('fast');
			$('.gallery_image.active').removeClass('active').prev().addClass('active');
		}
	});

	$('#video').bind('swiperight', function(event){
		console.log('swiperight');
		var parent = $(this).data().parent;
		$('#'+parent).addClass('active').siblings().removeClass('active');
		$('video').load();
	});


});


var map = null;

require(["esri/map", "esri/geometry/Point"], function(Map, Point) {
	$(function(){
		// document.addEventListener('tizenhwkey', function(e) {
	 //        if(e.keyName === "back") {
	 //            tizen.application.getCurrentApplication().exit();
	 //        }
	 //    });

		function positionToPoint(pos) {
			var c = pos.coords;
			return new Point(pos.coords.longitude, pos.coords.latitude);
		}

		function updateMapPosition(pos) {
			if(map) {
				map.centerAndZoom(positionToPoint(pos), 1.0);
			}
		}

		function setupMap(pos) {
			var c = pos.coords;
			map = new Map("map", {
				basemap: "streets",
				center: positionToPoint(pos),
				zoom: 18,
				slider: false
			});
		}

		function geoError(err) {
			console.log("Error (code " + err.code + "): " + err.message);
		}

		setupMap({coords: {latitude: 36.11356, longitude: -115.19864}});
		// navigator.geolocation.getCurrentPosition(setupMap, geoError);
		// navigator.geolocation.watchPosition(updateMapPosition, geoError);
	});
});
