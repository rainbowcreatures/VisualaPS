var pos;
var pos2;
var chapterAudio;
var canExitChapter;
var chapterText;
var chapterLayer;
var chapterKaraokeBox;
var playing;
var completeImagesList;
var slider1;
var slider2;

// Don't think about this too hard, it is just utility code
var KaraokeDefClass = function() {
	this.cssInit = false;
}
KaraokeDefClass.prototype.initCSS = function(css) {
	this.cssInit = true;
	$("<style type='text/css'> .current-word{ " + css + " } </style>").appendTo("head");
}
var KaraokeDef = new KaraokeDefClass();

function checkSliderPosition() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  if (pos == pos2) {
    if (pos == 1) {
      chapterAudio = 'rabbit.ogg';
      chapterText = 'rabbit.json';
      setTimeout(function() {
        window.animationEngine.playLayerAnimation('#rabbit_complete_125', 'default', true);

      }, 2000);
    }
    if (pos == 2) {
      chapterAudio = 'cat.ogg';
      chapterText = 'cat.json';
      setTimeout(function() {
        window.animationEngine.playLayerAnimation('#cat_complete_127', 'default', true);

      }, 2000);
    }
    chapterLayer = completeImagesList[pos - 1];
    chapterKaraokeBox = $(chapterLayer).find('.karaoke_inner');
    $(chapterLayer).show();
    $(chapterKaraokeBox).html('');
    $(chapterLayer).velocity({
      opacity: 1, },
     { duration: 2000,
    complete: function() {
      $(chapterKaraokeBox).visualaKaraoke({audio:chapterAudio, json:chapterText, onComplete: function() {  $('#paw_145').velocity({ opacity: 1 }, { display: "block", mobileHA: false });
        canExitChapter = 'true';
      }});
      KaraokeDef.initCSS('color:#ff0000;background:none');

    }
    , mobileHA: false
    });
  }
}


// INTERACTIVE BOOK FOR KIDS: DEMO
// ----------------------------------------------------------
// Main app initializations. Create variables and the slider puzzle sliders from layer groups.

$(document).ready(function() {
  $('.chapterImage').on(clickdown, function(event) {
    if (canExitChapter == 'true') {
      canExitChapter = 'false';
      $(chapterLayer).velocity({ opacity: 0 }, { display: "none", mobileHA: false });
      $('#paw_145').velocity({ opacity: 0 }, { display: "none", mobileHA: false });
    }

  });
  canExitChapter = 'false';
  window.animationEngine = new VisualaAnimationEngine($(document), function () {

  });
  window.animationEngine.loadFromJS();
  playing = 0;
  pos2 = 0;
  pos = 0;
  completeImagesList = [$('#rabbit_complete_125'), $('#cat_complete_127')];
  slider1 = $('#slider_1_31').Swipe({    transitionEnd: function() {  pos = slider1.getPos();
    ;
    checkSliderPosition();
  },    speed: 300,    draggable: true  }).data('Swipe')  ;
  slider2 = $('#slider_2_68').Swipe({    transitionEnd: function() {  pos2 = slider2.getPos();
    ;
    checkSliderPosition();
  },    speed: 300,    draggable: true  }).data('Swipe')  ;

});

