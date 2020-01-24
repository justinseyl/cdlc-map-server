var global_state = '';
var global_county = '';
var global_picker = '';

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

$('#state-tbl tbody tr td').on('click', function() {
  var st = $(this).html().trim();
  clickstate(st);
});

$('#map-states path').on('click', function() {
  var st = $(this).attr('id');
  clickstate(st);
});

function clickstate(st) {
  global_state = st;

  $("#map-states").hide();
  $("#back-to-home").show();
  if ($(window).width() < 720) {$("#back-to-home-mobile").show();}
  $("svg[stateLevel=" + st + "]").show();
  $("#state-tbl").hide();

  $.get("/getCountyByState?state=" + st, function (data) {
    buildTable(data);
  });
}

$('#back-to-home').on('click', function() {
  $("#map-states").show();
  $("#back-to-home").hide();
  $("svg[stateLevel]").hide();
  $("#county-tbl").hide();
  $("#state-tbl").show();

  global_state = '';
  global_county = '';
});

$('#back-to-home-mobile').on('click', function() {
  $("#back-to-home-mobile").hide();
  $("#county-tbl").hide();
  $("#state-tbl").show();

  global_state = '';
  global_county = '';
});

$("svg[stateLevel] path").on('click', function() {
  var cl = $(this).attr('class');
  var statecode = cl.split('_').pop();
  let st = state_specific[statecode].name;

  countyClick(st);
});

function countyClick(st) {
  global_county = st;
  window.location.href = 'county_table/' + global_state + '/' + global_county ;
}

function buildTable(data) {
  let cty = $("#county-tbl");

  cty.empty();
  cty.show();

  var header = '<tr>'+
  '              <th>COUNTY</th>'+
  '              <th>REPORTS</th>'+
  '            </tr>';

  cty.append(header);

  $.each(data, function(i,item){

    var html = '<tr>'+
    '                <td>'+
    '                  ' + item.county +
    '                </td>'+
    '                <td>'+
    '                  <span class="records-bubble">'+
    '                    ' + item.num +
    '                  </span>'+
    '                </td>'+
    '              </tr>';

    cty.append(html);
  });

  $('#county-tbl tr td').on('click', function() {
    var st = $(this).html().trim();
    countyClick(st);
  });
}
