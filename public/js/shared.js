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

String.prototype.capitalize = function(){
       return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
      };

function setCountyPicker(state,ct) {
  console.log(ct);
  $("#add-trouble-county-id").empty();

  var svg = $("svg[stateLevel='" + state + "'] path");

  $.each(svg, function(index, value) {
    var classlong = $(value).attr('class');
    var classcode = classlong.split('_').pop();
    var countyname = state_specific[classcode].name;

    var html = '<option value="' + countyname + '">' + countyname + '</option>';
    $("#add-trouble-county-id").append(html);
  });

  $("#add-trouble-county-id").html($("#add-trouble-county-id option").sort(function (a, b) {
    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
  }));
console.log(ct.toLowerCase().capitalize());
  if (ct) {
    $("#add-trouble-county-id").val(ct.toLowerCase().capitalize());
  } else {
    var initHtml = '<option value="" disabled selected hidden>Enter County...</option>';
    $("#add-trouble-county-id").prepend(initHtml);
  }
}

function popViewEmerg() {
  $("#cover").css('display','block');
  $("#view-emergency-popup").css('display','block');
}

function changetype(type) {
    $("#trouble3").attr("onClick", `changelink('${type}')`);
}

function changelink(type) {

  $("#cover").css('display','none');
  $("#add-trouble-popup").css('display', 'none');

  if (type == 'driver') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-driver").css('display','block');
  } else if (type == 'sales') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-sales").css('display','block');
  } else {
    $("#cover").css('display','block');
    $("#add-trouble-popup-processor").css('display','block');
  }
}

function getEventDetails(id, role) {
  console.log(role);
  $.get(`/getevent/${id}?role=${role}`, function (data) {
    let results = data[0];
    $("#county").html(results.county);
    $("#date").html(results.date);
    $("#time").html(results.time);
    $("#desc").html(results.description);
    $("#upl").html(results.userid);

    if (results.manage == 'pending') {
      $("#acceptevent").attr("href", `/accept/${id}`);
      $("#rejectevent").attr("href", `/reject/${id}`);
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
   "responsive": true
  });

  if ($(window).width() < 720) {
     $("#DataTables_Table_0 tr td:last-child").show();
     $("#DataTables_Table_0 tr td:last-child div").html('');
  }
});
