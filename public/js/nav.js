$(document).ready(function(){
    var element = $('meta[name="active-menu"]').attr('content');
    $('#' + element).addClass('active');
    $('#' + element + ' .nav-hr').show();

    var i = $('#' + element + ' img').attr('src');
    var str = i.split('/').pop();
    var x = str.split('-un')[0];

    var i = $('#' + element + ' img').attr('src','/assets/' + x + '.svg');

    var picker = $('meta[name="admin-picker"]').attr('content');
    console.log(picker);
});

$('#admin-select').on('change', function() {
  picker = this.value;
});
