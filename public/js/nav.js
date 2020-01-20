$(document).ready(function(){
    var element = $('meta[name="active-menu"]').attr('content');
    $('#' + element).addClass('active');
    $('#' + element + ' .nav-hr').show();
console.log(element);
    var i = $('#' + element + ' img').attr('src');
    var str = i.split('/').pop();
    var x = str.split('-un')[0];
    console.log(x);
    var i = $('#' + element + ' img').attr('src','/assets/' + x + '.svg');
    var picker = $('meta[name="admin-picker"]').attr('content');
    var menuitem = '';
});

$('#admin-select').on('change', function() {
  picker = this.value;
  $('meta[name="admin-picker"]').attr('content',picker);
});
