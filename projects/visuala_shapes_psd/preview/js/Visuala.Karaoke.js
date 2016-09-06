var TextFinder = function(options) {
	
	var t = this;
	
	// store options
	for (var opt in options) {
		t[opt] = options[opt];
	}
	
	t.skipTagsRegex = new RegExp('^(' + t.skipTags.join('|') + ')$', 'i');
	t.skipClassesRegex = new RegExp('\b(' + t.skipClasses.join('|') + ')\b', 'i');	
	
}

TextFinder.prototype = {
	
	foundTagName: 'span',
	foundTagClass: 'aligned-word',
	
	skipTags: [],
	skipClasses: [],
	
	root: null,
	currentDepth: -1,
	currentNode: null,
	
	lastSuccessfulNode: null,
	lastSuccessfulDepth: -1,
	
	currentText: '',
	
	reset: function() {
		this.lastSuccessfulNode = null;
		this.lastSuccessfulDepth = -1;		
	},
	
	// public function to start things up
	next: function(text) {
		
		var t = this;
		
		t.currentText = text;
		
		// if we haven't found a node yet, then we need to start over
		if (t.lastSuccessfulNode == null) {
			t.currentNode = t.root.childNodes[0];
			t.currentDepth = 1;
		} else {
			t.currentNode = t.lastSuccessfulNode;
			t.currentDepth = t.lastSuccessfulDepth;
		}
		
		return t._searchNodes();
	},
	
	_searchNodes: function() {
		
		var t = this,
			foundNode = null;
			
		
		
		// spin through nodes until we find the text
		while (t.currentNode && t.currentDepth > 0 && foundNode == null) {
	
			switch (t.currentNode.nodeType) {
				
				// for elements, we need to go down to the next level
				case 1: // ELEMENT_NODE
					if (!t.skipTagsRegex.test(t.currentNode.tagName.toLowerCase()) && // is this not a tag we should skip?
						!t.skipClassesRegex.test(t.currentNode.className.toLowerCase()) && 
						t.currentNode.childNodes.length > 0  //  does it have any child nodes 
						) {											
						
						t.currentNode = t.currentNode.childNodes[0];
						t.currentDepth++;
						continue;
					}
					break;
				case 3: // TEXT_NODE
				case 4: // CDATA_SECTION_NODE
					foundNode = t._findTextInNode();
					
					// once we find one the loop will stop
					if (foundNode != null) {
						
						t.lastSuccessfulNode = foundNode
						t.lastSuccessfulDepth = t.currentDepth;
						
						// clear out for the next round
						t.currentNode = null;
						t.currentDepth = -1;
						
						return foundNode;
					}
					break;
			}

			// if we didn't find anything in this node,
			// then go to the next sibling node or back up to the parent
			if (t.currentNode.nextSibling) {
				t.currentNode = t.currentNode.nextSibling;
			} else {
				
				while (t.currentDepth > 0) {
					t.currentNode = t.currentNode.parentNode;
					t.currentDepth --;
					if (t.currentNode.nextSibling) {
						t.currentNode = t.currentNode.nextSibling;
						break;
					}
				}
			}
		}		
		
		return null;
	},
	
	_findTextInNode: function() {				
		
		var t = this,
			wordIndex = t.currentNode.data.toLowerCase().indexOf(t.currentText.toLowerCase());
		
		if (wordIndex > -1) {
			
			var targetNode = (t.currentNode.nodeType == 1) ? t.currentNode.firstChild : t.currentNode;
				wordNode = targetNode.splitText(wordIndex),
				afterWord = wordNode.splitText(t.currentText.length),
				beforeWord = targetNode,
				
				highlightedWord = wordNode.ownerDocument.createElement(t.foundTagName);				
			wordNode.parentNode.replaceChild(highlightedWord, wordNode);						
			highlightedWord.setAttribute('class', t.foundTagClass);
			highlightedWord.appendChild(wordNode);
		
			return highlightedWord;
		} else {
			
			return null;
		}		
		
	}	
};

var AudioAligner = function(target, audio, audioUrl, timingUrl, onComplete) {
	
	var t = this;
	t.onComplete = onComplete;
	t.interval = null;

	// hook up to media
	t.audio = audio;

	// using timeupdate is suicide, it has very bad resolution so short words wouldn't trigger at all. We're using setInterval instead.
//	t.audio.addEventListener('timeupdate', function() { t.selectWord(); });

	t.audio.addEventListener('play', function() { t.startSelectWord(); });
//	t.audio.addEventListener('pause', function() { t.stopSelectWord(); });
	t.audio.addEventListener('ended', function() { t.stopSelectWord(); });
	t.audio.addEventListener('seeked', function() { t.selectWord(); });
	
	// target node where stuff will get loaded
	
	t.target = target;
	
	// node finder
	t.textfinder = new TextFinder({root: t.target, skipTags: ['h1','h2','h3'], skipClasses: ['cf','note','v-num']});
	t.audioUrl = audioUrl;
	t.timingUrl = timingUrl;
}

AudioAligner.prototype = {
	
	currentWordClassName: 'current-word',
	
	timingData: null,
	
	align: function() {		
		this.loadTimings();		
	},
	
	loadTimings: function() {
		var t = this;
		
		jQuery.ajax({
			url: t.timingUrl,
			dataType: 'json',
			success: function(json) {
				
				t.timingData = json.words;
				$(t.target).html(json.text);
				t.assignTimings();
				
				// start up MP3
				if (t.audio.setSrc) {
					t.audio.setSrc(t.audioUrl);
				} else {
					t.audio.src = t.audioUrl;
				}
				t.audio.oncanplay = function() {
					t.audio.play();
				};				
				t.audio.load();
			}
		});
	},
	
	assignTimings: function() {
		
		var t = this;
		
		// go through all the words in the array
		for (var wordIndex=0, wordTotal = t.timingData.length; wordIndex < wordTotal; wordIndex++) {
			var timing = t.timingData[wordIndex],
				word = timing[0];
						
			// attempt to find this word and create a new node out of it
			var node = t.textfinder.next(word);
			
			if (node != null) {
				
				// store node so we can refer to it as the audio plays
				timing[3] = node;

				// since we're in a loop, wrap it in a function
				(function(newTime) {
					
					// let the user click on the word and play from it
					node.addEventListener('click', function() {
						t.audio.currentTime = newTime;
					}, false);
				})(timing[1]);				
				
			}
			
		}
		
		t.textfinder.reset();
	},
	
	selectWord: function() {
		var t = this;
		
		if (t.timingData != null) {
			var time = t.audio.currentTime;
			
			// removing existing current class
			var currents = document.getElementsByClassName(t.currentWordClassName);
			if (currents.length > 0)
				currents[0].className = currents[0].className.replace(t.currentWordClassName, '');
			
			// find a word with the current time
			for (var i=0, il=t.timingData.length; i<il; i++) {
				var point = t.timingData[i];
				
				if (time >= point[1] && time <= point[2]) {
					var node = point[3];
					if (node !== undefined) {
						node.className += ' ' + t.currentWordClassName;
						node.focus();
					}
				}
			}	
		}	
	},

	startSelectWord: function() {
		var t = this;
		t.interval = setInterval(function() {
			t.selectWord();
		}, 0);
	},

	stopSelectWord: function() {
		var t = this;
		t.onComplete();
		if (t.interval != null) {
			clearInterval(t.interval);
		}
	}

};

(function ( $ ) {

    $.fn.visualaKaraoke = function( options, arg ) {
 
		var settings = {};
		var handleWidth = 0;
		var railWidth = 0;

		if(typeof options === 'object')
	        {
			if ($('#visualaKaraokeAudio').length == 0) {
				$("body").append('<audio id="visualaKaraokeAudio"></audio>');
			}
			settings = $.extend({
				// These are the defaults.
				audio: null,
				json: null,	
				play: true,	
				elementPlayer: $('#visualaKaraokeAudio')[0],		
				onComplete: function() {}
			}, options );

			// init plugin
			this.data("visualaKaraoke", settings);
			this.css("overflow", "hidden");
			if (settings.elementPlayer == null) {
				throw("Specify elementPlayer for the AudioAligner to work.");
				return;
			} 
			this.data('visualaKaraoke', new AudioAligner(this[0], settings.elementPlayer, settings.audio, settings.json, settings.onComplete));	
			if (settings.play) this.data('visualaKaraoke').align();
	        } else if(typeof options === 'string') {
			// "methods"
			if (options == "play") {
				$(this).data('visualaKaraoke').align();
			}
		}
		return this;
	};
}( jQuery ));


