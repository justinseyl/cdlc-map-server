const urlParams = new URLSearchParams(window.location.search);
const county = urlParams.get('county');
const state = urlParams.get('state');

if (state && county) {
  $("#county-label-id").html(state + ' - ' + county.toUpperCase());
}

$('#popTroubleTbl').on('click', function() {
  popAddTroubleTbl(state,county);
});

$(".expand").click(function() {
    if ($(this).hasClass("expand")) {
        $(this).removeClass("expand");
    }
    else {
         $(this).addClass("expand");
    }
});
