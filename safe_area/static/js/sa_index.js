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

jQuery(document).ready(function($){

	$('.burger').click(function (){
		$('.menu').removeClass('close').addClass('open')
		$('.menu-content').removeClass('close').addClass('open')
	});
	$('.close-menu').click(function (){
		$('.menu').removeClass('open').addClass('close')
		$('.menu-content').removeClass('open').addClass('close')
	});

	$('#map-btn').click(function (){
		$('#new-event').removeClass('btn-info').addClass('btn-outline-info')
		$(this).removeClass('btn-outline-info').addClass('btn-info')
		$('.new-event-container').removeClass('open').addClass('close')
		$('#map').removeClass('close').addClass('open')
	});

	function deleteMarkers() {
		if (markersObjects) {
			for (i in markersObjects) {
				markersObjects[i].setMap(null);
			}
			markersObjects.length = 0;
		}
	}

	function render_list(data){
		let html = "";
		data.forEach(val=>{
			let thumbnail = val.media.file || "/static/img/no-image.webp";
			html += `<div class="item position-relative">
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
			const infowindow = new google.maps.InfoWindow({
				content: events[i].content,
			});
			const marker = new google.maps.Marker({
				position: events[i].coord,
				map: map,
				icon: markers[events[i].type]
			});
			marker.addListener("click", () => {
				infowindow.open({
					anchor: marker,
					map,
					shouldFocus: false,
				});
			});
			markersObjects.push(marker)
		}
	}


	function get_events(){
		$.ajax({
			url: urls.get_events,
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
						type: val.type_of_situation,
						content: `<div>${val.description}</div>`,
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
			mapId: 'b8ac68d09a125f13'
		});

		initialLocation = new google.maps.LatLng(49.76, 21.13);
		map.setCenter(initialLocation);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(initialLocation);
				zoom = 15;
				map.setZoom(zoom);
			});
		}


		google.maps.event.addListener(map, 'dragend', function () {
			console.log(this.getCenter().lat(), this.getCenter().lng(), this.zoom)
			deleteMarkers()
			get_events()
		});
	}

	initialize();
	get_events();
})