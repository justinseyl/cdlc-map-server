$( document ).ready(function() {
  if ($(window).width() < 720) {
     $(".custom-buttons").html('<img src="/assets/icon-close-copy-3.svg"/>');
     $("#map-container").remove();
     $(".footer-map").remove();
  }
});
