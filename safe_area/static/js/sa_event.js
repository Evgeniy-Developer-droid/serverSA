jQuery(document).ready(function ($) {

  $(document).on('click', '#listing .item', function (){
      $('.event-wrap').removeClass('close').addClass('open')
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

  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
  });

})