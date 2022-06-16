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

  let slide = parseInt($('input#slide').val())
  let slider_count = parseInt($('input#slider_count').val())

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