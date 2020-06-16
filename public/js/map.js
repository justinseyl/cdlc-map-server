var global_state = '';
var global_county = '';
var global_picker = '';
const picker = window.location.pathname.split('/')[2];

$("path").hover(function(e) {
  if ($("#map-states:visible").length <= 0) {
    var cl = e.target.className.baseVal;
    var statecode = cl.split('_').pop();
    let st = state_specific[statecode].name;

    $('#info-box').css('display','block');
    $('#info-box').html('<h1>' + st + '</h1>');
  }
});
$("path").mouseleave(function(e) {
  if ($("#map-states:visible").length <= 0) {
    $('#info-box').css('display','none');
  }
});
$(document).mousemove(function(e) {
  if ($("#map-states:visible").length <= 0) {
    $('#info-box').css('top',e.clientY);
    $('#info-box').css('left',e.clientX);
  }
}).mouseover();

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

  $.get("/getCountyByState?state=" + st + "&picker=" + picker, function (data) {
    buildTable(data);
  });
}

$('#back-to-home').on('click', function(e) {
  if (e.target.nodeName != 'INPUT') {
    $("#map-states").show();
    $("#back-to-home").hide();
    $("svg[stateLevel]").hide();
    $("#county-tbl").hide();
    $("#state-tbl").show();

    global_state = '';
    global_county = '';
  }
});

$('#back-to-home-mobile').on('click', function(e) {
  if (e.target.nodeName != 'INPUT') {
    $("#back-to-home-mobile").hide();
    $("#county-tbl").hide();
    $("#state-tbl").show();

    global_state = '';
    global_county = '';
  }
});

$( "#map-search" ).keyup(function() {
  let text = $(this).val().toLowerCase();
  $( "svg[statelevel=" + global_state + "]" ).children('path').each(function () {
    var cl = this.className.baseVal;
    var statecode = cl.split('_').pop();
    let st = state_specific[statecode].name.toLowerCase();

    if (!st.includes(text)) {
      $("." + cl).hide();
      $("." + cl).css({ fill: 'transparent' });
    } else {
      $("." + cl).show();
      $("." + cl).css({ fill: 'rgba(74, 179, 173, 0.4)' });
    }

    if (text == '' || !text) {
      $("." + cl).css({ fill: 'transparent' });
    }
});
});

$("svg[stateLevel] path").on('click', function() {
  var cl = $(this).attr('class');
  var statecode = cl.split('_').pop();
  let st = state_specific[statecode].name;

  countyClick(st);
});

function countyClick(st) {
  global_county = st;
  if (picker == undefined) {
    window.location.href = 'county_table/' + global_state + '/' + global_county
  } else {
    window.location.href = 'county_table/' + global_state + '/' + global_county + '?picker=' + picker ;
  }
}

function buildTable(data) {
  let cty = $("#county-tbl");

  cty.empty();
  cty.show();

  var header = '<tr>'+
  '              <th style="color: #62657d;">COUNTY</th>'+
  '              <th style="color: #62657d;">REPORTS</th>'+
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
