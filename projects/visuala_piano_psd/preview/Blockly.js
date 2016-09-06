var notesLoadedNum;
var noteName;

function tryToEnableKeyboard() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  // Just take note of how many notes we have loaded

  notesLoadedNum = Number(notesLoadedNum)  +  Number(1) ;
  // Once we have all the notes loaded we can start listening for key clicks / taps

  if (notesLoadedNum == 5) {
    window.alert('Audio loaded');
    // As soon as all notes are loaded add listeners to the keys

    $('.key').on( clickdown, function() {
      // A little effect, this fades in the pressed layer when we hold mouse over key layer,
      // to give an illusion of pressing the keyboard key.

      $(this).find('.pressed').show();
      // Get the property named "noteName", which we assigned in the layer properties earlier. Then we can
      // play the right mp3 audio for each note.

      noteName = $(this).data('properties')['note'];
      $('#' + noteName).jWebAudio('stop');
      $('#' + noteName).jWebAudio('play');

    });
    $('.key').on( clickup, function() {
      // As soon as we release the key we should fade in the "pressed" layer again so the key
      // returns to the original unpressed state.

      $(this).find('.pressed').hide();

    });
  }
}


// APP START
// -----------------
// Load all available notes,only then enable the piano,
// otherwise we might not hear anything at first.

$(document).ready(function() {
  notesLoadedNum = 0;
  window.alert('Loading audio');
  $('body').append('<div id="' + 'C' + '"></div>');
  $('#' + 'C').jWebAudio('addSoundSource', { 'url': 'data/C.mp3', 'preLoad': true, 'loop': false, 'callback': function() {
     tryToEnableKeyboard();

  }
  });
  $('body').append('<div id="' + 'D' + '"></div>');
  $('#' + 'D').jWebAudio('addSoundSource', { 'url': 'data/D.mp3', 'preLoad': true, 'loop': false, 'callback': function() {
     tryToEnableKeyboard();

  }
  });
  $('body').append('<div id="' + 'E' + '"></div>');
  $('#' + 'E').jWebAudio('addSoundSource', { 'url': 'data/E.mp3', 'preLoad': true, 'loop': false, 'callback': function() {
     tryToEnableKeyboard();

  }
  });
  $('body').append('<div id="' + 'C_' + '"></div>');
  $('#' + 'C_').jWebAudio('addSoundSource', { 'url': 'data/C_.mp3', 'preLoad': true, 'loop': false, 'callback': function() {
     tryToEnableKeyboard();

  }
  });
  $('body').append('<div id="' + 'D_' + '"></div>');
  $('#' + 'D_').jWebAudio('addSoundSource', { 'url': 'data/D_.mp3', 'preLoad': true, 'loop': false, 'callback': function() {
     tryToEnableKeyboard();

  }
  });

});

