$(document).ready(function() {
  var animationEngine = new VisualaAnimationEngine($(document), function () {

  });
  animationEngine.loadFromJS();
  $('#Button_background_3').on(clickdown, function() {
    animationEngine.playLayerAnimation('#Scene_47', 'default');

  });

});

