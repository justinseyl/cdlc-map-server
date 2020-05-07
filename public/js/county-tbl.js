const urlParams = new URLSearchParams(window.location.search);
// const county = urlParams.get('county');
// const state = urlParams.get('state');
const county = window.location.pathname.split('/')[3];
const state = window.location.pathname.split('/')[2];

if (state && county) {
    let c = county.replace('%',' ');
    c = c.replace(/\d/g, '');
    $("#county-label-id").html(state + ' - ' + c.toUpperCase());
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
