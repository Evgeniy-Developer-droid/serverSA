jQuery(document).ready(function ($) {

  $(document).on('click', '.sa-slide', function (){
    window.open($(this).data('url'), '_blank').focus();
  })


  $('#close-event').click(function (){
    $('.event-wrap').addClass('close').removeClass('open');
  })

  $('.listing-btn').click(function (){
    if($('#listing').hasClass('close')){
      $('#listing').removeClass('close').addClass('open')
    }else{
      $('#listing').addClass('close').removeClass('open');
    }
    $(this).toggleClass('open');
  })

  let slide = 0;
  let slider_count = 0;

  $(document).on('click', '#listing .item', function (){
    let elem = $(this);
    let url_arr = urls.get_event.split('/');
    url_arr.pop();
    $.ajax({
      url: url_arr.join('/')+"/"+elem.data('id'),
      method: 'GET',
      success: function (data){
        let images = data.media.filter(val => val.extension === 'image');
        let videos = data.media.filter(val => val.extension === 'video');
        slide = 0;
        slider_count = images.length;
        $('.slides .sa-slide').remove()
        $('.video-slider .video-item').remove();
        if(images.length !== 0){
          for(let i = 0; i < images.length; i++){
            $('.slider .slides').append(`
              <div class="sa-slide ${i === 0 ? 'active' : ''}" data-key="${i}" data-url="${images[i].file}" style="background-image: url('${images[i].file}')"></div>
            `)
          }
          $('.slider').css('display', 'block')
        }else{
          $('.slider .slides').append(`
              <div class="sa-slide active" data-key="0" data-url="/static/img/no-image.webp" style="background-image: url('/static/img/no-image.webp')"></div>
            `)
        }

        if(videos.length !== 0){
          for(let i = 0; i < videos.length; i++){
            $('.video-slider').append(`
              <div class="video-item">
                    <video name='demo' controls>
                        <source src="${videos[i].file}"></source>
                    </video>
                </div>
            `)
          }
          $('.video-slider').css('display', 'block')
        }else{
          $('.video-slider').css('display', 'none')
        }
        $('.description-wrap').html(data.description)
        $('.event-wrap').removeClass('close').addClass('open')
      }
    })
  })

  $('.l-arr').click(function (){
    $(".slides").find(`[data-key='${slide}']`).removeClass('active');
    if(slide === 0){slide = slider_count-1;}else{slide -= 1;}
    $(".slides").find(`[data-key='${slide}']`).addClass('active');
  });

  $('.r-arr').click(function (){
    $(".slides").find(`[data-key='${slide}']`).removeClass('active');
    if(slide+1===slider_count){slide=0}else{slide += 1;}
    $(".slides").find(`[data-key='${slide}']`).addClass('active');
  });

})