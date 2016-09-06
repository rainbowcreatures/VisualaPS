var starMatched;
var circleMatched;
var triangleMatched;

function checkWin() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  if (starMatched && (triangleMatched && circleMatched)) {
    window.alert('SUCCESS!');
  }
}


$(document).ready(function() {
  starMatched = false;
  circleMatched = false;
  triangleMatched = false;
  $('#star_hole_3').droppable({ accept:'#star_4', tolerance:'intersect', activeClass:'', hoverClass: '',
   drop: function(ev, ui) {
   $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
    starMatched = true;
    checkWin();

  },

  });
  $('#star_4').draggable({ containment:'', axis:'',
   start: function() {

  },
   drag: function() {

  },
   stop: function() {

  }
  });
  $('#circle_hole_6').droppable({ accept:'#circle_5', tolerance:'intersect', activeClass:'', hoverClass: '',
   drop: function(ev, ui) {
   $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
    circleMatched = true;
    checkWin();

  },

  });
  $('#circle_5').draggable({ containment:'', axis:'',
   start: function() {

  },
   drag: function() {

  },
   stop: function() {

  }
  });
  $('#triangle_hole_8').droppable({ accept:'#triangle_7', tolerance:'intersect', activeClass:'', hoverClass: '',
   drop: function(ev, ui) {
   $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
    triangleMatched = true;
    checkWin();

  },

  });
  $('#triangle_7').draggable({ containment:'', axis:'',
   start: function() {

  },
   drag: function() {

  },
   stop: function() {

  }
  });

});

