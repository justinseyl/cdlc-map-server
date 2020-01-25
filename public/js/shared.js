var eventid = '';
var grole = '';
var extrar = '';
var admin_bool = false;
const ctablechk = window.location.pathname.split('/')[2];
const county2 = window.location.pathname.split('/')[4];
const state2 = window.location.pathname.split('/')[3];
var gtable = '';

var currenteuid = '';



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

function popTrouble(picker) {
  if (picker == 'DRIVER') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-driver").css('display','block');
    $("#state6").val(state2);
    setCountyPicker(state2,county2);
  } else if (picker == 'SALES') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-sales").css('display','block');
    $("#state2").val(state2);
    setCountyPicker(state2,county2);
  } else if (picker == 'PROCESSOR') {
    $("#cover").css('display','block');
    $("#add-trouble-popup-processor").css('display','block');
    $("#state5").val(state2);
    setCountyPicker(state2,county2);
  }
}

$("#add-trouble-state-id").on('change', function (e) {
    var valueSelected = this.value;
    setCountyPicker(valueSelected);
});

$("#state").on('change', function (e) {
    var valueSelected = this.value;
    setCountyPicker(valueSelected);
});

$("#admin-select").on('change', function (e) {
  if (ctablechk == 'county_table') {
    var val = this.value;
    if (val == "/adminhome/driver") {
      location.href = `/adminhome/county_table/${state2}/${county2}?picker=driver`;
    } else if (val == "/adminhome/processor") {
      location.href = `/adminhome/county_table/${state2}/${county2}?picker=processor`;
    } else if (val == "/adminhome/sales" ) {
      location.href = `/adminhome/county_table/${state2}/${county2}?picker=sales`;
    }
  }
});

$("#state2").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerP(valueSelected);
});

$("#state3").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerJ(valueSelected);
});

$("#state5").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerAP(valueSelected);
});

$("#state6").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerAS(valueSelected);
});

$("#state7").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerK(valueSelected);
});

$("#state8").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerL(valueSelected);
});

$("#state9").on('change', function (e) {
  var valueSelected = this.value;
  setCountyPickerM(valueSelected);
});

$("#stateinput").on('change', function(e) {
  var valueSelected = this.value;
  setCountyPicker2(valueSelected);
})

function setCountyPickerM(state,ct,div) {
  let set = $("#county9");
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


function setCountyPickerJ(state,ct,div) {
  let set = $("#county3");
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

function setCountyPickerL(state,ct,div) {
  let set = $("#county8");
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

function setCountyPickerK(state,ct,div) {
  let set = $("#county7");
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


function setCountyPickerP(state,ct,div) {
  let set = $("#county2");
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

function setCountyPickerAP(state,ct,div) {
  let set = $("#county5");
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

function setCountyPickerAS(state,ct,div) {
  let set = $("#county6");
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

function setCountyPicker2(state,ct,div) {
  let set = $("#countyinput");
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

function getEventDetails(id, role,admin, extra, userid) {
  $.get(`/getevent/${id}?role=${role}`, function (data) {
    let results = data[0];

    $("#id").val(results.id);
    role = role.toLowerCase();
    if (admin == 'admin') {
      admin_bool = true;
    }

      $("#county").html(results.county);
      $("#date").html(results.date);
      $("#time").html(results.time);
      $("#desc").html(results.description);
      $("#upl").html(results.userid);
      $("#state").html(results.state);

    if (role == 'sales') {
      $("#sales").html(results.saleprice);
      $("#state4").html(results.state);
      $("#desc4").html(results.description);
      $("#county4").html(results.county);
    }

    if (role == 'processor') {
      $("#aname").html(results.attorneyname);
      $("#address").html(results.address);
      $("#email").html(results.email);
      $("#fax").html(results.fax);
      $("#price").html(results.fee);
      $("#state3").html(results.state);
      $("#desc3").html(results.description);
      $("#county3").html(results.county);
    }

    var accept = `#acceptevent`;
    var reject = `#rejectevent`;
    var accepted = `#accepted`;

    if (admin == 'admin') {

      if (role == 'processor') {
        accept = `#accepteventp`;
        reject = `#rejecteventp`;
        accepted = `#acceptedp`;
      } else if (role == 'sales') {
        accept = `#acceptevents`;
        reject = `#rejectevents`;
        accepted = `#accepteds`;
      }

      if (results.manage == 'pending') {
        $(accept).attr("onClick", `window.location.href='/accept/${id}?role=${role}'`);
        $(reject).attr("onClick", `window.location.href='/reject/${id}?role=${role}'`);
        $(accept).show();
        $(reject).show();
        $(accepted).hide();
      } else {
        $(accepted).attr("onClick", `getedit('${id}')`);
        $("#deleted").attr("onClick",   `deleteevent('${id}','DELETE EVENT','Are you sure you wish to delete this event?  This action can\’t be undone.','YES IM SURE','NO I CHANGED MY MIND','/deleteevent/${id}')`);
        $(accept).hide();
        $(reject).hide();
        $(accepted).show();
      }
    } else {
      if (userid == results.userid) {
        $(accepted).attr("onClick", `getedit('${id}')`);
        $("#deleted").attr("onClick",   `deleteevent('${id}','DELETE EVENT','Are you sure you wish to delete this event?  This action can\’t be undone.','YES IM SURE','NO I CHANGED MY MIND','/deleteevent/${id}')`);
        $(accept).hide();
        $(reject).hide();
        $(accepted).show();
        if (role == 'sales' || role == 'processor') {
          $("#delbut").hide();
        }
      } else {
        $("#delbut").hide();
        $(accept).hide();
        $(reject).hide();
        $(accepted).hide();

      }
    }


    eventid = id;
    grole = role;
    extrar = extra;

    $("#cover").css('display','block');


    if (admin == 'admin') {
      if (role == 'driver') {
        $("#click-event-driver").css('display', 'block');
      } else if (role == 'sales') {
        $("#click-event-sales").css('display', 'block');
      } else {
        $("#click-event-processor").css('display', 'block');
      }

      if (extra == 'driver') {

        accept = `#accepteventd`;
        reject = `#rejecteventd`;
        accepted = `#acceptedd`;

        $(accepted).attr("onClick", `getedit('${id}')`);
        $("#deleted").attr("onClick",   `deleteevent('${id}','DELETE EVENT','Are you sure you wish to delete this event?  This action can\’t be undone.','YES IM SURE','NO I CHANGED MY MIND','/deleteevent/${id}')`);
        $(accept).hide();
        $(reject).hide();
        $(accepted).show();
        $('#click-event-driver').css('display', 'block');
        $("#click-event").css('display', 'none');
      }
    } else {
      $("#eventname").html(`${role.toUpperCase()} EVENT`);
      $("#click-event").css('display', 'block');

      if (extra == 'driver') {

        accept = `#accepteventd`;
        reject = `#rejecteventd`;
        accepted = `#acceptedd`;

        $(accepted).attr("onClick", `getedit('${id}')`);
        $("#deleted").attr("onClick",   `deleteevent('${id}','DELETE EVENT','Are you sure you wish to delete this event?  This action can\’t be undone.','YES IM SURE','NO I CHANGED MY MIND','/deleteevent/${id}')`);
        $(accept).hide();
        $(reject).hide();
        $(accepted).show();
        $('#click-event-driver').css('display', 'block');
        $("#click-event").css('display', 'none');
      }
    }

  });

}

function delevt(role) {
  deleteevent('', 'DELETE EVENT', 'Are you sure you want to delete this event?', 'Yes, I\'m sure', 'No, I changed my mind', `/deleteevent/${eventid}/${role}`);
}

function deleteevent(id,header,desc,confirmtext,canceltext,route) {
  $(".popup-panel").hide();
  $("#are-you-sure").show();
  $("#cover").show();

  $("#are-you-sure").find(".popup-header").html(header);
  $("#are-you-sure").find(".popup-desc").html(desc);
  $("#are-you-sure").find(".submit-btn").html(confirmtext);
  $("#are-you-sure").find(".cancel-btn").html(canceltext);
  $("#are-you-sure").find("#hiddenId").val(id);
  $("#are-you-sure").find("#submit-are-you-sure").attr('action',route);
}

function searchuser() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("userinput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

$('path').on("click", function() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  filter = this.id;

  if (table) {
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
});

function searchstate() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("stateinput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  if (filter != 'ALL') {
    gtable.column(1).search(filter).draw();
  } else {
// Invalidate all rows and redraw
    gtable.search( '' ).columns().search( '' ).draw();
  }
}

function searchstate2() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("stateinput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  if (filter != 'ALL') {
        gtable.column(1).search(filter).draw();
  } else {
// Invalidate all rows and redraw
    gtable.search( '' ).columns().search( '' ).draw();
  }
}

function backcountry() {
  location.href = '/';
}

function searchnew() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("new");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      txtValue = td.textContent || td.innerText;
      var date2 = new Date();
      var date1 = new Date(txtValue);
      var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);

      if (filter == 'NEW') {
        if (diffDays <= 1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } else {
        tr[i].style.display = "";
      }

    }
  }
}


function searchcounty() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("countyinput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function getedit(eid) {
  let id = eventid;
  if (eid) {
    id = eid;
  }
  $.get("/getevent/" + id + `?role=${grole}`, function(data) {
    let results = data[0];

    $("#edit1").attr("action", `/edit/${id}?role=${grole}`);
    $("#edit2").attr("action", `/edit/${id}?role=${grole}`);
    $("#edit3").attr("action", `/edit/${id}?role=${grole}`);


    if (grole == 'admin' || admin_bool == true) {
      let p = grole.toLowerCase();
      let temp1 = `#click-event-${p}`
      let temp2 = `#edit-event-${p}`

      $("#cover").css('display','none');
      $(temp1).css('display', 'none');
      $("#cover").css('display','block');
      $(temp2).css('display', 'block');

    } else {

      if (extrar == 'driver') {
        $("#click-event-driver").css('display', 'none');
        $("#edit-event-driver").css('display', 'block');
      } else {
        $("#cover").css('display','none');
        $("#click-event").css('display', 'none');
        $("#cover").css('display','block');
        $("#edit-event").css('display', 'block');
      }
    }

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
  gtable = $('table').DataTable({
    "ordering": true,
    "searching": true,
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
