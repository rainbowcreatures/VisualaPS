var inputValue;


$(document).ready(function() {
  $('#button_get_3').on(clickdown, function() {
    inputValue = $('#input_2').val();
    window.alert(inputValue);

  });
  $('#button_set_5').on(clickdown, function() {
    $('#input_2').val('Hello world!');

  });

});

