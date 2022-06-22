const markers = {
	'murder': document.getElementById('red_icon').value,
	'accident': document.getElementById('blue_icon').value,
	'fight': document.getElementById('yellow_icon').value,
	'theft': document.getElementById('okean_icon').value,
	'shooting': document.getElementById('green_icon').value,
	'other': document.getElementById('white_icon').value,
}
var map;
var zoom = 5;
var events = [];
var markersObjects = [];
var infowindow = null;
var Coord = {'lat':49.76, 'lon':21.13}

jQuery(document).ready(function($){

	$(document).on('mouseenter', '#listing .item', function (){
		let elem = $(this);
		let marker = markersObjects.filter(val => val.id === elem.data('id'))
		if(marker.length !== 0){
			map.panTo(marker[0].marker.getPosition());
			new google.maps.event.trigger( marker[0].marker, 'click' );
		}
	})

	$(document).on('click', '.map-btn-info-window', function (){
		let id = $(this).data('id');
		$('#listing').find(`[data-id='${id}']`).click();
	});

	$('.filter-btn').click(function (){
		$('.filter').removeClass('close-filter').addClass('open-filter');
	})
	$('.close-filter-btn').click(function (){
		$('.filter').removeClass('open-filter').addClass('close-filter');
	})

	$('#map-btn').click(function (){
		$('#new-event').removeClass('btn-info').addClass('btn-outline-info')
		$(this).removeClass('btn-outline-info').addClass('btn-info')
		$('.new-event-container').removeClass('open').addClass('close')
		$('#map').removeClass('close').addClass('open')
	});

	const infoWindowContent = (data) => {
		let image = data.media?.file || "/static/img/no-image.webp";
		return `<div class="info-window">
					<img src="${image}" alt="">
					<p>${data.desc_short}</p>
					<div class="btn btn-sm btn-dark w-100 map-btn-info-window" data-id="${data.id}">View</div>
			</div>`
	}

	function deleteMarkers() {
		if (markersObjects) {
			for (i in markersObjects) {
				markersObjects[i].marker.setMap(null);
			}
			markersObjects.length = 0;
		}
	}

	function render_list(data){
		let html = "";
		data.forEach(val=>{
			let thumbnail = val.media.file || "/static/img/no-image.webp";
			html += `<div class="item position-relative" data-id="${val.id}" data-lat="${val.lat}" data-lon="${val.lon}">
				<span class="position-absolute type ${val.type_of_situation}" title="${val.type_of_situation}"></span>
            	<div class="img  col-4" style="background-image: url('${thumbnail}');"></div>
            	<div class="meta col">
            		<div class="hidd"><p>${val.description}</p></div>
            		<div class="t_li">
						<span class="time">${val.timestamp}</span>
						<div class="media">
							<div class="photo">
								<i class="bi bi-camera-fill"></i> <span>${val.meta.image}</span>
						</div>
						<div class="video">
							<i class="bi bi-camera-reels-fill"></i> <span>${val.meta.video}</span>
						</div>
						</div>
					</div>
            	</div>
            </div>`
		})
		$('#listing').html(html)
	}
	function render_markers(){
		for(let i = 0; i < events.length; i++){
			const marker = new google.maps.Marker({
				position: events[i].coord,
				map: map,
				icon: markers[events[i].type]
			});
			marker.addListener("click", () => {
				if (infowindow) {
					infowindow.close();
				}
				infowindow = new google.maps.InfoWindow({
					content: events[i].content,
				});
				infowindow.open({
					anchor: marker,
					map,
					shouldFocus: false,
				});
			});
			markersObjects.push({'id':events[i].id, 'marker': marker})
		}
	}

	$('.filter input[name="start"], .filter input[name="end"], .filter input[type="checkbox"]').on('change', function (){
		deleteMarkers()
		get_events(Coord.lat, Coord.lon, zoom);
	})


	function get_events(lat, lon, zoom){
		let parameters = ""
		parameters += `&start=${$('.filter input[name="start"]').val()}`
		parameters += `&end=${$('.filter input[name="end"]').val()}`
		let types = []
		$('.filter input[type="checkbox"]:checked').each(function (index, val){
			types.push($(this).attr('id'))
		})
		if(types.length !== 0){
			parameters += "&types="+types.join('|')
		}
		$.ajax({
			url: urls.get_events+`?lat=${lat}&lon=${lon}&zoom=${zoom}${parameters}`,
			method: 'GET',
			beforeSend: function (){
				$('#listing').addClass('d-flex flex-column align-items-center justify-content-center');
				$('#listing').html(`<div class="spinner-border text-info" role="status">
				  <span class="visually-hidden">Loading...</span>
				</div>`);
			},
			success: function (data){
				$('#listing').removeClass('d-flex flex-column align-items-center justify-content-center');
				events = []
				data.forEach(val=>{
					events.push({
						id: val.id,
						type: val.type_of_situation,
						content: infoWindowContent(val),
						coord:{
							lat: val.lat,
							lng: val.lon
						}
					})
				})
				render_markers();
				render_list(data);
			}
		})
	}

	function initialize(){
		map = new google.maps.Map(document.getElementById("map"), {
			zoom: zoom,
			minZoom: 4,
			mapId: 'b8ac68d09a125f13',
			zoomControl: false,
			mapTypeControl: false,
			streetViewControl: false
		});

		initialLocation = new google.maps.LatLng(Coord.lat, Coord.lon);
		map.setCenter(initialLocation);


		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(initialLocation);
				zoom = 15;
				Coord.lat = position.coords.latitude
				Coord.lon = position.coords.longitude
				map.setZoom(zoom);
				get_events(position.coords.latitude, position.coords.longitude, zoom);
			}, function (data){
				get_events(Coord.lat, Coord.lon, zoom)
			});
		}

		// if (navigator.geolocation) {
		// 	navigator.geolocation.getCurrentPosition(function (position) {
		// 		initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		// 		map.setCenter(initialLocation);
		// 		zoom = 15;
		// 		defaultCoord.lat = position.coords.latitude
		// 		defaultCoord.lon = position.coords.longitude
		// 		map.setZoom(zoom);
		// 		get_events(position.coords.latitude, position.coords.longitude, zoom);
		// 	});
		// }else{
		// 	get_events(defaultCoord.lat, defaultCoord.lon, zoom)
		// }


		google.maps.event.addListener(map, 'dragend', function () {
			// console.log(this.getCenter().lat(), this.getCenter().lng(), this.zoom)
			Coord.lat = this.getCenter().lat();
			Coord.lon = this.getCenter().lng();
			zoom = this.zoom;
			deleteMarkers()
			get_events(this.getCenter().lat(), this.getCenter().lng(), this.zoom)
		});
	}

	initialize();

})