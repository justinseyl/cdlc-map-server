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

$("#add-trouble-state-id").on('change', function (e) {
    var valueSelected = this.value;
    setCountyPicker(valueSelected);
});

function setCountyPicker(state) {
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

  var initHtml = '<option value="" disabled selected hidden>Enter County...</option>';
  $("#add-trouble-county-id").prepend(initHtml);
}

function popViewEmerg() {
  $("#cover").css('display','block');
  $("#view-emergency-popup").css('display','block');
}

function closepopup() {
  $("#cover").css('display','none');
  $(".popup-panel").css('display','none');

  location.reload();
}

function setLocalState(st) {
console.log(st);
}
