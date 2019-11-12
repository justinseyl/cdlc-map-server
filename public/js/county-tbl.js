const urlParams = new URLSearchParams(window.location.search);
const county = urlParams.get('county');
const state = urlParams.get('state');

$("#county-label-id").html(state + ' - ' + county.toUpperCase());

$('#popTroubleTbl').on('click', function() {
  popAddTroubleTbl(state,county);
});
