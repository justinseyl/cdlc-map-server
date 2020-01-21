var eventid = '';
function verify(id) {
  $("#cover").css('display','block');
  $(id).css('display','block');
}

function popAddTrouble(user) {
  var state = '';
  var county = '';

  $("#cover").css('display','block');
  $("#add-trouble-popup").css('display','block');

  if (global_state && global_state != '') {
    state = global_state;
  } else {
    state = user;
  }

  $("#add-trouble-state-id").val(state);

  setCountyPicker(state);
}

function popAddTroubleSub(user) {
  var state = '';
  var county = '';

  $("#cover").css('display','block');
  $("#add-trouble-popup").css('display','block');

  state = user;

  $("#add-trouble-state-id").val(state);

  setCountyPicker(state);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function popAddTroubleTbl(st,ct) {
  $("#cover").css('display','block');
  $("#add-trouble-popup").css('display','block');

  $("#add-trouble-state-id").val(st);

  setCountyPicker(st,ct);
}

$("#add-trouble-state-id").on('change', function (e) {
    var valueSelected = this.value;
    setCountyPicker(valueSelected);
});

$("#state").on('change', function (e) {
    var valueSelected = this.value;
    setCountyPicker(valueSelected,'','county');
});

String.prototype.capitalize = function(){
       return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
      };

function setCountyPicker(state,ct,div) {
  let set = $("#add-trouble-county-id");

  if (div) {
    set = $("#" + div);
  }

  let setid = $(set).attr('id');
  $(set).empty();

  var svg = $("svg[stateLevel='" + state + "'] path");

  $.each(svg, function(index, value) {
    var classlong = $(value).attr('class');
    var classcode = classlong.split('_').pop();
    var countyname = state_specific[classcode].name;

    var html = '<option value="' + countyname + '">' + countyname + '</option>';
    $(set).append(html);

  });

  $(set).html($("#" + setid + " option").sort(function (a, b) {
    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
  }));

  if (ct) {
    $(set).val(ct.toLowerCase().capitalize());
  } else {
    var initHtml = '<option value="" disabled selected hidden>Enter County...</option>';
    $(set).prepend(initHtml);
  }
}

function popViewEmerg() {
  $("#cover").css('display','block');
  $("#view-emergency-popup").css('display','block');
}

function changelink(type) {

  $("#cover").css('display','none');
  $("#add-trouble-popup").css('display', 'none');

  if (type == 'SALES') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-sales").css('display','block');
  } else if (type == 'DRIVER') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-driver").css('display','block');
  } else {
    $("#cover").css('display','block');
    $("#add-trouble-popup-processor").css('display','block');
  }
}

function getEventDetails(id, role) {
  $.get(`/getevent/${id}?role=${role}`, function (data) {
    let results = data[0];

    setCountyPicker(results.state,results.county,'county');

    if (results.role || results.role == 'null' || results.role == '') {
      $("#county").val(results.county);
      $("#desc").val(results.description);
      $("#state").val(results.state);
      $("#id").val(results.id);
    } else {
      $("#county").html(results.county);
      $("#date").html(results.date);
      $("#time").html(results.time);
      $("#desc").html(results.description);
      $("#upl").html(results.userid);
    }

    if (results.manage == 'pending') {
      $("#acceptevent").attr("href", `/accept/${id}?role=${role}`);
      $("#rejectevent").attr("href", `/reject/${id}?role=${role}`);
      $("#pending1").show();
      $("#pending2").show();
      $("#accepted").hide();
    } else {
      $("#accepted").attr("onClick", `getedit(${id})`);
      $("#pending1").hide();
      $("#pending2").hide();
      $("#accepted").show();
    }

    eventid = id;

    $("#cover").css('display','block');
    $("#click-event").css('display', 'block');
  });

}

function deleteevent() {
  $.get("/deleteevent/" + eventid, function(rlt) {
    $(".popup-panel").css('display','none');
    $("#cover").css('display','none');
    location.reload();
  })
}

function getedit() {
  $.get("/getevent/" + eventid, function(data) {
    let results = data[0];

    $("#county2").val(results.county);
    $("#desc2").val(results.description);
    $("#state2").val(results.state);

    $("#edit").attr("action", `/edit/${eventid}`);

    $("#cover").css('display','none');
    $("#click-event").css('display', 'none');
    $("#cover").css('display','block');
    $("#edit-event").css('display', 'block');
  });
}

function closepopup() {
  $("#cover").css('display','none');
  $(".popup-panel").css('display','none');

  location.reload();
}

function closepopup2() {
  $("#cover").css('display','none');
  $(".popup-panel").css('display','none');

}

$(document).ready(function() {
  $('table').DataTable({
    "ordering": true,
    "searching": false,
    "pagingType": "full_numbers",
    "dom": '<bottam>p',
    "drawCallback": function(settings) {
      var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
      pagination.toggle(this.api().page.info().pages > 1);
    },
    "fnInitComplete" : function() {
      if ($(this).find('.dataTables_empty').length==1) {
         $(this).parent().hide();
      }
   },
   "responsive": true,
   "ordering": false
  });

  if ($(window).width() < 720) {
     $("#DataTables_Table_0 tr td:last-child").show();
     $("#DataTables_Table_0 tr td:last-child div").html('');
  }
});
