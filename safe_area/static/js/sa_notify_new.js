jQuery(document).ready(function($){
	let lat = 49.76;
	let lng = 21.13;
	let map;

	$('#new-event').click(function(e){
		e.preventDefault()
		map = new google.maps.Map(document.getElementById("map_notify"), {
			zoom: 5,
			minZoom: 4,
			mapId: 'b8ac68d09a125f13'
		});

		let initialLocation = new google.maps.LatLng(lat, lng);
		map.setCenter(initialLocation);

		function setMarker(){
			console.log(lat, lng)
			$("#latitude").val(lat);
			$("#longitude").val(lng);
			let marker = new google.maps.Marker({
				position: {lat: lat, lng: lng},
				map: map,
				draggable:true,
			});
			google.maps.event.addListener(marker, 'dragend', function(marker){
				let latLng = marker.latLng;
				let currentLatitude = latLng.lat();
				let currentLongitude = latLng.lng();
				$("#latitude").val(currentLatitude);
				$("#longitude").val(currentLongitude);
			});
		}

		navigator.permissions.query({ name: 'geolocation' }).then(data=>{
			if(data.state === 'granted'){
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						lat = position.coords.latitude;
						lng = position.coords.longitude;
						initialLocation = new google.maps.LatLng(lat, lng);
						map.setCenter(initialLocation);
						map.setZoom(15);
						setMarker();
					});
				}
			}else{
				setMarker();
			}
		})
		$('#map-btn').removeClass('btn-info').addClass('btn-outline-info')
		$(this).removeClass('btn-outline-info').addClass('btn-info')
		$('#map').removeClass('open').addClass('close')
		$('.new-event-container').removeClass('close').addClass('open')

	})

	function deleteAllMedia() {
		let url_arr = urls.delete_media.split('/');
		url_arr.pop()
		$('.file_input').each(function (index){
			let elem = $(this);
			$.ajax({
				url: url_arr.join('/')+"/"+elem.data('id'),
				method: 'DELETE',
				headers: {
					"X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
				},
				success: function (data) {
					elem.remove()
				}
			});
		})
	}

	$(document).on('click', '.sa_upload', function (e){
		$(this).siblings('input').click();
	})

	$(document).on('click', '.sa_remove', function (e){
		let parent = $(this).parent();
		let url_arr = urls.delete_media.split('/');
		url_arr.pop()
		$.ajax({
			url: url_arr.join('/')+"/"+parent.data('id'),
			method: 'DELETE',
			headers: {
				"X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
			},
			success: function (data) {
				console.log(data);
				parent.remove()
			}
		});
	})

	$(document).on('change', 'input[type="file"]', function (e){
		let data = new FormData();
		let parent = $(this).parent();
		if(e.target.files.length !== 0){
			let file = e.target.files[0];
			let extension = e.target.files[0].type.split('/')[0];
			data.append('file', file, file.name);
			data.append('extension', extension);
			$.ajax({
				url: urls.upload_media,
				method: 'POST',
				headers: {
					"X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
				},
				processData: false,
				contentType: false,
				data: data,
				success: function (data){
					parent.data('id', data.id);
					if(data.extension === 'image'){
						parent.css('background-image', `url('${data.file}')`);
					}else{
						parent.css('background-image', `url('/static/img/video-logo.webp')`);
					}
					let icon = parent.children('.sa_upload');
					icon.removeClass('sa_upload');
					icon.addClass('sa_remove');
					icon.html('<i class="bi bi-x-circle-fill"></i>');
				}
			})
		}
	})

	$('.sa_add').click(function (){
		let html = `<div class="file_input box_file" data-id="">
                            <div class="sa_icon sa_upload">
                                <i class="bi bi-cloud-arrow-up"></i>
                            </div>
                            <input type="file" accept="video/*,image/*" class="d-none">
                        </div>`
		$('.files .box_file:last').before(html)
	})

	$('#publish').click(function (){
		let ids = [];
		$('.file_input').each(function (){
			if($(this).data('id')){
				ids.push($(this).data('id'));
			}
		})
		const data = {
			lat: $("#latitude").val(),
			lon: $("#longitude").val(),
			description: $('#description').val(),
			media_ids: ids,
			type_of_situation: $('.form-check-input:checked').val()
		}
		$.ajax({
			url: urls.new_event,
			method: 'POST',
			headers: {
				"X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
			},
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json",
			success: function (data) {
				$('.file_input').remove()
				$('#description').val("");
				$('#map-btn').click()
			}
		});
	})


})