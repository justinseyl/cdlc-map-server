$( document ).ready(function() {
  if ($(window).width() < 720) {
     $(".mobile-container").show();
     $(".container").remove();
  }
});
