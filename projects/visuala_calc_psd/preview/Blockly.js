var layer;
var bigtextnumber;
var memory;
var clear_display;
var smalltextnumber;
var operation;

function text_get_substring(text, where1, at1, where2, at2) {
  function getAt(where, at) {
    if (where == 'FROM_START') {
      at--;
    } else if (where == 'FROM_END') {
      at = text.length - at;
    } else if (where == 'FIRST') {
      at = 0;
    } else if (where == 'LAST') {
      at = text.length - 1;
    } else {
      throw 'Unhandled option (text_getSubstring).';
    }
    return at;
  }
  at1 = getAt(where1, at1);
  at2 = getAt(where2, at2) + 1;
  return text.slice(at1, at2);
}

function animateButtonPress(layer) {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  // This method animates the button layer, notice how we chained fade in and
  // fade out into the final desired effect.

  $(layer).find('.button_press').velocity({ opacity: 1 }, { display: "block" }).velocity({ opacity: 0 }, { display: "none" });
}


// CALCULATOR v1.0
// APP INITIALIZATION
// -------------------------------
// Here we reset all of our variables

$(document).ready(function() {
  memory = 0;
  secondnumber = 0;
  bigtextnumber = "";
  operation = "";
  clear_display = 'false';
  $('#result_135').css("font-family", "calculator_ttf");
  $('#result_135').attr('style', $('#result_135').attr('style') + ';' + 'text-align:right;font-size:80px;margin-top:40px')
  $('#result_135').html('0')

});

// CLICKS ON OPERATION BUTTONS (+, -, = ....)
// ---------------------------------------------------------------------
// This finds out what kind of button we clicked, and performs
// appropriate action as well. This is the "brain" of our calculator!

$(document).ready(function() {
  $('.button_action').on(clickdown, function() {
    animateButtonPress(this);
    if (memory == 0) {
      memory = bigtextnumber;
    }
    if (operation == 'plus') {
      memory = Number(memory)  +  Number(bigtextnumber) ;
    }
    if (operation == 'minus') {
      memory = Number(memory)  -  Number(bigtextnumber) ;
    }
    if (operation == 'multiply') {
      memory = Number(memory)  *  Number(bigtextnumber) ;
    }
    if (operation == 'divide') {
      memory = Number(memory)  /  Number(bigtextnumber) ;
    }
    if (operation == 'sqrt') {
      memory = Math.sqrt(bigtextnumber);
    }
    if ($(this).data('properties')['action'] == 'equals') {
      bigtextnumber = String(memory);
      // Only display the first 13 numbers of the result, otherwise the numbers would overflow the display, uh oh

      bigtextnumber = text_get_substring(bigtextnumber, 'FIRST', 1, 'FROM_START', 13);
      $('#result_135').html(bigtextnumber)
      memory = 0;
      operation = "";
    } else {
      operation = $(this).data('properties')['action'];
    }
    clear_display = 'true';

  });

});

// CLICKS ON NUMERIC BUTTONS (0...9)
// ----------------------------------------------------------
// We are looking for clicks on all 'button' layers. As soon
// as we get a click, we gain access to the layer we clicked
// on. We can get its properties, "number" in this case.
//

$(document).ready(function() {
  $('.button').on(clickdown, function() {
    animateButtonPress(this);
    if (clear_display == 'true') {
      // This is a "clearing block", basically after you type
      // a number & tap some button for math operation, you
      // want the display clean for the next number. If the
      // clear_display flag is set to "true", thats what happens.

      bigtextnumber = "";
      $('#result_135').html('')
      // Remember to set the clear flag back to false!

      clear_display = 'false';
    }
    // This gets the layer property "number", so we know what number we clicked
    // on. Then it adds (joins) the smalltextnumber to the bigtextnumber so we can
    // create a large number from individual digits repeating this.

    smalltextnumber = $(this).data('properties')['number'];
    bigtextnumber = String(bigtextnumber) + String(smalltextnumber);
    bigtextnumber = text_get_substring(bigtextnumber, 'FIRST', 1, 'FROM_START', 13);
    $('#result_135').html(bigtextnumber)

  });

});

// The clear function clears both the memory and the display

$(document).ready(function() {
  $('#clear_46').on(clickdown, function() {
    animateButtonPress(this);
    bigtextnumber = '';
    $('#result_135').html('0')
    memory = 0;
    operation = '';

  });

});

