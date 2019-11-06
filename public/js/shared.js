function popAddTrouble() {
  $("#cover").css('display','block');
  $("#add-trouble-popup").css('display','block');
}

function closepopup() {
  $("#cover").css('display','none');
  $(".popup-panel").css('display','none');

  location.reload();
}
