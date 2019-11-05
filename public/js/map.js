$("path, circle").hover(function(e) {
  $('#info-box').css('display','block');
  $('#info-box').html($(this).data('info'));
});

$("path, circle").mouseleave(function(e) {
  $('#info-box').css('display','none');
});

var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if(ios) {
  $('a').on('click touchend', function() {
    var link = $(this).attr('href');
    window.open(link,'_blank');
    return false;
  });
}

$('#map-states path').on('click', function() {
  var st = $(this).attr('id');

  $("#map-states").hide();
  $("#back-to-home").show();
  $("svg[stateLevel=" + st + "]").show();
});

$('#back-to-home').on('click', function() {
  $("#map-states").show();
  $("#back-to-home").hide();
  $("svg[stateLevel]").hide();
});
