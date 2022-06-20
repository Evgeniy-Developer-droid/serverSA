jQuery(document).ready(function ($){
    $('.burger').click(function (){
		$('.menu').removeClass('close').addClass('open')
		$('.menu-content').removeClass('close').addClass('open')
	});
	$('.close-menu').click(function (){
		$('.menu').removeClass('open').addClass('close')
		$('.menu-content').removeClass('open').addClass('close')
	});

	$('.send-feedback').click(function (){
		const data = {
			name: $('#name').val(),
			email: $('#email').val(),
			text: $('#text').val()
		}
		$.ajax({
			url: urls.send_feedback,
			method: 'POST',
			headers: {
				"X-CSRFToken": $('input[name="csrfmiddlewaretoken"]').val(),
			},
			data: JSON.stringify(data),
			dataType: "json",
        	contentType: "application/json",
			success: function (data) {
				$('.alert').remove()
				$('#name').val("");
				$('#email').val("");
				$('#text').val("");
				$(".container .row .block-form").prepend(`
					<div class="alert alert-success opacity-animation-content" role="alert"><p>Thanks for your feedback!</p></div>
				`)
			},
			error: function (data){
				$('.alert').remove()
				html = `<div class="alert alert-danger opacity-animation-content" role="alert">`
				Object.keys(data.responseJSON).forEach(val=>{
					html += `<b>${val}</b> - <span>${data.responseJSON[val]}</span><br>`
				})
				html += "</div>"
				$(".container .row .block-form").prepend(html)
			}
		});
	})
})