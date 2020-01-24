const urlParams = new URLSearchParams(window.location.search);
// const county = urlParams.get('county');
// const state = urlParams.get('state');
const county = window.location.pathname.split('/')[4];
const state = window.location.pathname.split('/')[3];

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