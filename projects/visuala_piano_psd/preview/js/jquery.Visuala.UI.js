// TODO: update function if switches to object functions

//** SLIDER
//** ------

(function ( $ ) {

    $.fn.visualaSlider = function( options, arg ) {
 
		var settings = {};
		var handleWidth = 0;
		var railWidth = 0;

		if(typeof options === 'object')
	        {
			settings = $.extend({
				// These are the defaults.
				elementHandle: null,
				elementRail: null,
				start: function() {},
				stop: function() {},
				drag: function() {},
				value: 0,
				axis: "x"
			}, options );

			// init plugin
			this.data("visualaSlider", settings);
			if (settings.elementHandle == null || settings.elementRail == null) {
				throw("Specify elementHandle and elementRail for the slider.");
				return;
			} 
	
			// get width of rail and handle
		 	handleWidth = $(settings.elementHandle).width();
			railWidth = $(settings.elementRail).width();
			var self = this;
			settings.elementRail.live("click", function(e) {
				var posX = $(this).offset().left;
			        var sliderPos = (e.pageX - posX);
				if (sliderPos > railWidth - handleWidth) sliderPos = railWidth - handleWidth;
				// when moving the handle via rail, we must emulate firing the right events
				settings.start.call(self);
				settings.elementHandle.animate({'left': sliderPos},{
								 step: function(now,fx){ 
									$(self).data("visualaSlider", {value: settings.elementHandle.position().left / (railWidth - handleWidth)});
									settings.drag.call(self);
								 },
								 complete: function() {
									settings.stop.call(self);
								 }												
								});
			});

		        settings.elementHandle.draggable({
		            start: function() {
				settings.start.call(self);
			    },
			    stop: function() {    	
				settings.stop.call(self);
			    },
			    containment: settings.elementRail,
			    drag: function() {
				$(self).data("visualaSlider", {value: settings.elementHandle.position().left / (railWidth - handleWidth)});
				settings.drag.call(self);
			    },
		            axis: settings.axis,
		        }); 

	        }

		// "methods"
	        else if(typeof options === 'string') {
			if (options == "value") {
			        if (typeof arg === "undefined" || arg === null) { 
					return $(this).data("visualaSlider").value;				
				} else {
					var railWidth = $(this).data("visualaSlider").elementRail.width();
					var handleWidth = $(this).data("visualaSlider").elementHandle.width();
					$(this).data('visualaSlider').elementHandle.css('left', Math.round(arg * (railWidth - handleWidth)) + 'px');
					$(this).data('visualaSlider', {value: arg});					
				}
			}
		}
		return this;
    };
 
}( jQuery ));