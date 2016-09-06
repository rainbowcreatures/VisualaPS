// Visuala 
// the animation engine

var VisualaAnimationEngine = function(documentDOM, timeChangeCallback, stopCallback) {
	this.FORCE_NEW_KEYFRAME = -2;
	this.TRY_REPLACE_KEYFRAME = -1;	
	this.ANIMATE_THIS = 0;
	this.ANIMATE_ALL = 1;
	this.mode = this.ANIMATE_THIS;
	this.animationLayers = [];
	this.DOMLayers = [];
	this.animInterval = null;	
	this.currentTime = 0;
	this.documentDOM = documentDOM;
	// for simulating fake clock to preview animations at any point in time instantly
	this.clock = null;
	this.currentTime = 0;
	this.updateTime = true;
	this.timeChangeCallback = timeChangeCallback;
	this.timeChangeCallbackObject = null;
	this.stopCallback = stopCallback;
	this.stopCallbackObject = null;
	this.activeLayer = null;
	this.playing = false;
}

VisualaAnimationEngine.prototype.setMode = function(mode) {
	this.mode = mode;
}

VisualaAnimationEngine.prototype.save = function() {
	var saveObj = {};
	saveObj.animationLayers = [];
	for (var a = 0; a < this.animationLayers.length; a++) {
		saveObj.animationLayers.push(this.animationLayers[a].save());
	}
	return saveObj;
}

// load the animation object straight from JS file
VisualaAnimationEngine.prototype.loadFromJS = function() {
	this.documentDOM.append("<script type='text/javascript' src='anims.js'></script>");
	if (typeof VisualaAnimsObj !== 'undefined') {
		this.load(VisualaAnimsObj);
	} else {
		console.log("Couldn't load animations, the file anims.js was not found. Maybe you didn't create any timeline animations?");
	}
}

VisualaAnimationEngine.prototype.load = function(saveObj) {
	// clear up animation layers
	this.animationLayers = [];
	for (var a = 0; a < saveObj.animationLayers.length; a++) {
		var layer = this.addAnimationLayer(saveObj.animationLayers[a].id);
		if (layer != null) {
			console.log("Loading animation layer " + saveObj.animationLayers[a].id + "...");
			layer.load(saveObj.animationLayers[a]);
		}
	}
}

VisualaAnimationEngine.prototype.setTimeChangeCallback = function(callback, object) {
	this.timeChangeCallbackObject = object;
	this.timeChangeCallback = callback;
}

VisualaAnimationEngine.prototype.setStopCallback = function(callback, object) {
	this.stopCallbackObject = object;
	this.stopCallback = callback;
}

VisualaAnimationEngine.prototype.deactivateAllLayers = function() {
	for (var a = 0; a < this.animationLayers.length; a++) {
		this.animationLayers[a].active = false;
	}
}

VisualaAnimationEngine.prototype.getCurrentTime = function() {
	return this.currentTime;
}

VisualaAnimationEngine.prototype.getLayerByID = function(id) {
	var animationLayers = this.animationLayers;
	for (var a = 0; a < animationLayers.length; a++) {
		if (animationLayers[a].id * 1 == id * 1) {
			return animationLayers[a];
		}
	}
	return null;
}

VisualaAnimationEngine.prototype.setCurrentTime = function(t, previewAnimation) {
	// sometimes we need to switch this off to prevent accidents, like when dragging a keyframe
	if (this.updateTime) {
		this.currentTime = t;		
		if (previewAnimation) {
			this.previewFrameAtTime(this.currentTime);
		}
		this.timeChangeCallback(t, this.timeChangeCallbackObject);
	}
}		

VisualaAnimationEngine.prototype.compare = function (a, b) {
	if (a.time < b.time)
		return -1;
	else if (a.time > b.time)
		return 1;
	else 
	return 0;
}

	
VisualaAnimationEngine.prototype.addAnimationLayer = function (id) {
	// check if this animation layer exists or not..if yes then do not add it
	var animationLayers = this.animationLayers;
	for (var a = 0; a < animationLayers.length; a++) {
		if (animationLayers[a].id == id) {
			animationLayers[a].active = true;
			return animationLayers[a];
		}
	}

	var DOM = this.documentDOM.find("[id$='_" + id + "']");
	if (!DOM.length) {
		console.log("Couldn't add animation layer, because the layer " + id + " couldn't be found in the DOM");
		return null;
	} else {
		
		// new method to create layer tree, the older method wasn't working right, it was cloning layers
		function arrayRecursive($arr) {
			var result = [];
			// with > .item you go only 1 level deeper per step
			$arr.find('>[data-lyrid]').each(function(index, item) {
				var obj = {};
				obj.id = $(item).attr('data-lyrid');
				obj.children = arrayRecursive($(item));
				result.push(obj);
			});
			result.reverse();
			return result;
		}
		
		var temp = [];
		var tempObj = {};
		tempObj.id = id;
		tempObj.children = [];
		tempObj.children = arrayRecursive(DOM);				
		temp.push(tempObj);
		
        // extract the layer tree from DOM -> convert to array
		function extract() {
		    var $this = $(this);
		    return {
		    id: $this.data('lyrid'),					
			       children: $this
			           .find('> img[id],> div[id]')	// [id]: ensure that we only take into account layers with id attribute, there might be temp layers from components which have no id assigned. TODO: might create "safer" check to make sure these are Visuala Photoshop layers, and not anything else.
			           .map(extract)
			           .get()
			   };
		}
		
		var layer = new AnimationLayer(this, id);	
		layer.setLayerDOM(DOM);
		animationLayers.push(layer);
		// add 1 default empty animation for each layer
		layer.addAnimation("default", true);
/*		layer.layerTree = DOM.find('> img,div').addBack(DOM).map(extract).get();
		console.log("built layerTree new method: " + JSON.stringify(temp));
		layer.layerTree = [layer.layerTree[0]];
		console.log("built layerTree old method: " + JSON.stringify(layer.layerTree));*/
		layer.layerTree = temp;
		console.log("built layerTree: " + JSON.stringify(layer.layerTree));
		// remember parent of the tree too, good for the animation editor UI so we can return to parents
		if (DOM.parent().attr('data-lyrid')) {
			layer.layerTreeParent = DOM.parent().addBack(DOM.parent()).map(extract).get();
			layer.layerTreeParent = [layer.layerTreeParent[0]];
		} else {
			layer.layerTreeParent = null;
		}
		return layer;
	}
}

VisualaAnimationEngine.prototype.previewFrameAtTime = function(time) {
	var animationLayers = [];
	if (this.activeLayer == null) {
		console.error("Active layer is null, cannot preview animation!");
		return;
	}

	if (this.mode == this.ANIMATE_THIS) {
		this.activeLayer.getTreeAsSingleArray(this.activeLayer.layerTree, animationLayers);
	} else {
		animationLayers = this.animationLayers;
	}

	// make sure all children are set to the parent animation, if possible
	this.activeLayer.setActiveAnimationByName(this.activeLayer.getActiveAnimation().name);						

	for (var a = 0; a < animationLayers.length; a++) {
		var layer = animationLayers[a];
		var activeAnimation = layer.getActiveAnimation();

		var keyframes = activeAnimation.keyframes;
		var startKeyframe = null;
		var endKeyframe = null;
		if (keyframes.length > 0 && !activeAnimation.playing) {					
			for (var b = 0; b < keyframes.length; b++) {
				// in case we request position at keyframe we just set the layer properties and exit, no fake animation needed
				if (keyframes[b].time == time) {
					layer.setProperties(keyframes[b].animObject);
					break;
				} 
				// find the first keyframe of the "animation"
				if (keyframes[b].time < time) {
					startKeyframe = keyframes[b];
					layer.setProperties(startKeyframe.animObject);
					// TODO: optimize, move below for loop or it is fired many times
				} 
				// find the last keyframe of the "animation", if it exists fake-animate there
				if (keyframes[b].time > time && startKeyframe != null) {
					endKeyframe = keyframes[b];

					layer.setProperties(startKeyframe.animObject);

					if (endKeyframe.animObject.easing == 'none') break;

					// setup the fake timers
					if (this.clock == null) {
						this.clock = sinon.useFakeTimers(0);
					}
					
					// start the fake animation
					$.Velocity.tickDelay = time - startKeyframe.time;
					layer.animate(endKeyframe.animObject, endKeyframe.time - startKeyframe.time);
					// skip straight into the moment we're interested in, let the animator figure the rest out
					this.clock.tick(time - startKeyframe.time);
					$.Velocity.tickDelay = 16;
//					console.log("endKeyframe.time: " + endKeyframe.time + ", startKeyframe.time: " + startKeyframe.time);
					// stop the fake animation as well
					layer.layerDOM.velocity("stop", true);
					// important to tick after stop to give the timers the chance to clear themselves, otherwise we'll end up with hundreds of timers bogging us down in sinon
					this.clock.tick(100);
					this.clock.restore();
					this.clock = null;

					break;
				}
			}
			// if no endkeyframe was found but startkeyframe was, play that(but only that)
			if (endKeyframe == null && startKeyframe != null) {
//				layer.setProperties(startKeyframe.animObject);
			}
		}
	}			
}

// try to find all layers corresponding to animation layers in the DOM and connect them to animation layers
VisualaAnimationEngine.prototype.updateLayersDOM = function() {
	for (var a = 0; a <  this.animationLayers.length; a++) {
		var layer = this.animationLayers[a];
		layer.updateLayerDOM();
	}
}

VisualaAnimationEngine.prototype.stopAllAnimations = function() {
	if (this.animInterval != null) {
		clearInterval(this.animInterval);
		this.animInterval = null;
	}
	for (var a = 0; a < this.animationLayers.length; a++) {
		var layer = this.animationLayers[a];
		layer.layerDOM.velocity("stop", true);
		layer.getActiveAnimation().stop();
		layer.resetAllAnimationsKeyframes();
	}	
	this.playing = false;
}

VisualaAnimationEngine.prototype.rewind = function() {
//	this.setCurrentTime(0, true);
	this.setCurrentTime(0, true);
}

VisualaAnimationEngine.prototype.playLayerAnimation = function(layerID, animName, loop) {
	var temp = layerID.split('_');
	var actualID = temp[temp.length - 1];
	var layer = this.getLayerByID(actualID * 1);
	if (layer == null) {
		console.error("Layer " + layerID + " not found in the animations list. Make sure an animation was created for this layer in the timeline editor.");
		return;
	}
	this.activeLayer = layer;
	var animation = layer.setActiveAnimationByName(animName);
	this.playAnimation(loop);
}

VisualaAnimationEngine.prototype.playAnimation = function(loop) {

	
	if (this.clock != null) {
		this.clock.restore();
		this.clock = null;
	}

	if (this.activeLayer == null) {
		console.error("Active layer is null, cannot play animation!");
		return;
	}

	this.stopAllAnimations();
	this.rewind();            

	var animationLayers = [];

	if (this.mode == this.ANIMATE_THIS) {
		this.activeLayer.getTreeAsSingleArray(this.activeLayer.layerTree, animationLayers);
	} else {
		animationLayers = this.animationLayers;
	}

	// prepare all active animations for playing
	var maxTime = 0;
	for (var a = 0; a < animationLayers.length; a++) {
		var layer = animationLayers[a];
		var activeAnimation = layer.getActiveAnimation();
		var lastKeyframe = activeAnimation.getLastKeyframeTime();
		if (lastKeyframe > maxTime) {
			maxTime = lastKeyframe;
		}
		console.log("BUBAK Set animation layer " + animationLayers[a].name + " to " + activeAnimation.name);
		activeAnimation.play();
	}

	playing = true;

	var lastUpdate = Date.now();
	var self = this;

	this.animInterval = setInterval(function() {
		// compute delta time
		var now = Date.now();
		var dt = now - lastUpdate;     
		lastUpdate = now;
		var currentTimeSec = 0;
		if (dt > 1) {
			// increase time
			self.setCurrentTime(self.currentTime + dt, false);
			currentTimeSec = self.currentTime * 0.001;
			// TODO stop animation if we've reached the furthest keyframe
			if (self.currentTime >= maxTime) {
				if (loop) {
					for (var a = 0; a < self.animationLayers.length; a++) {
						var layer = self.animationLayers[a];
						layer.resetAllAnimationsKeyframes();
						layer.getActiveAnimation().play();
					}	
					self.setCurrentTime(0, false);
				} else {
					self.stopAllAnimations();
					if (self.stopCallback != null) self.stopCallback(self.stopCallbackObject);					
					return;
				}
				
			}
			for (var a = 0; a < animationLayers.length; a++) {     	
				var layer = animationLayers[a];
					var activeAnimation = layer.getActiveAnimation();
					var keyframes = activeAnimation.keyframes;
					var nextPlayedKeyframe = activeAnimation.nextPlayedKeyframe;								
					if (keyframes.length > 0 && activeAnimation.playing) {
	
						var timeNeeded = keyframes[nextPlayedKeyframe].time - self.currentTime;							
						var animObject = keyframes[nextPlayedKeyframe].animObject;
	
						if (!keyframes[nextPlayedKeyframe].played) {
							if (keyframes[nextPlayedKeyframe].animObject.easing != 'none') {
								layer.animate(animObject, timeNeeded);
							}
							keyframes[nextPlayedKeyframe].played = true;
						}
	
						if ((keyframes[nextPlayedKeyframe]).time <= self.currentTime) {
							// play keyframe
//							console.log("Played keyframe at " + currentTimeSec);
							// set the end position(it should match the transition end, but in case there's no transition this is also good
							// to "teleport" the layer to the destination.
							layer.setProperties(animObject);
	
							if (keyframes.length > nextPlayedKeyframe + 1) {
								activeAnimation.nextPlayedKeyframe++;
							} else {
								// end of layer playing in case there's no more keyframes
								activeAnimation.stop();
								console.log("No more keyframes left at layer " + layer.id);
							}
						}
					}
				
			}
		}
	}, 0);
}


// animation layer, the basic class
var AnimationLayer = function(engine, id) {
	this.engine = engine;
	this.id = id;
	this.name = "";
	this.active = true;
	this.animations = [];
	this.activeAnimation = 0;	
	this.layerDOM = null;
	this.layerTree = [];
}

AnimationLayer.prototype.getTreeAsSingleArray = function(treeArray, array) {
	for (var a = 0; a < treeArray.length; a++) {
		array.push(this.engine.getLayerByID(treeArray[a].id));
		if (treeArray[a].children.length > 0) {
			this.getTreeAsSingleArray(treeArray[a].children, array);
		}
	}
	return array;
}

AnimationLayer.prototype.setName = function(name) {
	this.name = name;
}

AnimationLayer.prototype.save = function() {
	var saveObj = {};
	saveObj.id = this.id;
	saveObj.animations = [];
	for (var a = 0; a < this.animations.length; a++) {
		saveObj.animations.push(this.animations[a].save());
	}
	return saveObj;
}

AnimationLayer.prototype.load = function(saveObj) {
	this.animations = [];
	this.id = saveObj.id;
	for (var a = 0; a < saveObj.animations.length; a++) {			
		var anim = this.addAnimation(saveObj.animations[a].name, false);
		console.log("Loading animation " + saveObj.animations[a].name + "...");
		anim.load(saveObj.animations[a]);
	}
}

AnimationLayer.prototype.updateLayerDOM = function() {
	layer.setLayerDOM(engine.documentDOM.find("[id$='_" + this.id + "']"));
}

AnimationLayer.prototype.setLayerDOM = function(l) {
	this.layerDOM = l;
}

AnimationLayer.prototype.getActiveAnimation = function() {
	return this.animations[this.activeAnimation];
}

AnimationLayer.prototype.setActiveAnimationByIndex = function(index) {
	if (index < 0 || index >= this.animations.length) { 	
		console.error("Animation index " + index + " out of bounds(0.." + this.animations.length + " ).");
		return;
	}
	this.activeAnimation = index;
//	console.log("Setting active animation to index " + index);
	return;
}

AnimationLayer.prototype.renameAnimation = function(name) {	
	this.getActiveAnimation().name = name;
}

AnimationLayer.prototype.setActiveAnimationByName = function(name) {
	var layers = [];

	var nameArray = name.split(',');
	name = nameArray[0];
	// get tree as single array, get all layers and set active animations for them
	this.getTreeAsSingleArray(this.layerTree, layers);
	// try to set animation by name on all children as well, if they exist
	for (var l = 0; l < layers.length; l++) {	
		var found = false;
		for (var a = 0; a < layers[l].animations.length; a++) {	
			var targetNameArray = layers[l].animations[a].name.split(',');
			for (var b = 0; b < targetNameArray.length; b++) {
				if (targetNameArray[b] == name && !found) {
					found = true;
					console.log("Layer " + layers[l].name + " set animation to " + name + "(index " + a + ")");
					layers[l].setActiveAnimationByIndex(a);				
				}		
			}
		}
		if (!found) {
//			console.log("Layer " + layers[l].name + ": Animation " + name + " not found when trying to set it as active.");
		}
	}
//	console.log(this.animations.length);
//	return false;
}


AnimationLayer.prototype.resetAllAnimationsKeyframes = function() {
	for (var b = 0; b < this.animations.length; b++) {
		this.animations[b].resetKeyframes();
	}
}

// method for animating a layer based on passed animObject
AnimationLayer.prototype.animate = function(animObject, timeNeeded) {
	var self = this;
	// animation type: translate
	// -------------------------
	// in case the keyframe was not played yet, play it	
	if (animObject.type == "trns") {
//		if (animObject.easing != "none") {
			this.layerDOM.css('transform-origin', animObject.originX + ' ' + animObject.originY);
			this.layerDOM.velocity({
				left: animObject.x,
				top: animObject.y,
				opacity: animObject.opacity,
				scale: animObject.scale,
				rotateZ: animObject.rotate,
				complete: function() {
				}
			}, {duration: timeNeeded, easing: animObject.easing});
//		}
	}				
}

// add animations to this layer and all children, if they don't exist yet (by name)
AnimationLayer.prototype.addAnimations = function (name) {
	var layers = [];
	this.getTreeAsSingleArray(this.layerTree, layers);
	for (var a = 0; a < layers.length; a++) {
		if (!layers[a].animationExists(name)) {
			layers[a].addAnimation(name, true);
		}
	}
}

AnimationLayer.prototype.setProperties = function (animObject) {
	// animation type: translate
	// -------------------------
	if (animObject.type == "trns") {
		// start the fake animation	
		this.animate(animObject, 1);	
		// setProperties is used in a spot with and without fake time both, so we must tick if we've got fake time
		if (this.engine.clock != null) {
			this.engine.clock.tick(1);
		}
		this.layerDOM.velocity("finish", true);

	}
	if (animObject.type == "anim") {
	}

}

AnimationLayer.prototype.animationExists = function(name) {
	for (var a = 0; a < this.animations.length; a++) {
		if (this.animations[a].name == name) return true;
	}
	return false;
}

// add new animation to animation layer
AnimationLayer.prototype.addAnimation = function(animname, createDefaultKeyframe) {
	var layername = this.name;

	if (this.animationExists(animname)) return null;

	var animation = new Animation(this.engine, animname);
	this.animations.push(animation);

	// make this active
	var oldActiveAnimation = this.activeAnimation;

	if (createDefaultKeyframe) {
		this.activeAnimation = this.animations.length - 1;
//		this.addDefaultKeyframe();
		// make active the old one again
		this.activeAnimation = oldActiveAnimation;
	}

	return animation;
}

AnimationLayer.prototype.addDefaultKeyframe = function() {
	// add default position, scaling, rotation and opacity for this layer
	var animObject = {};						
	animObject.type = "trns";
	animObject.x = this.layerDOM.data('properties_private').left;
	animObject.y = this.layerDOM.data('properties_private').top;
	animObject.opacity = 1.0;
	animObject.scale = 1.0;
	animObject.rotate = 0;
	animObject.easing = 'none';
	animObject.id = 0;
	animObject.originX = '50%';
	animObject.originY = '50%';
	animation.updateKeyframe(0, animObject, this.engine.FORCE_NEW_KEYFRAME, []);
}

// AnimationLayer ---> animation, animation, animation...
// consists of keyframes and other properties.
var Animation = function(engine, name) {
	this.engine = engine;
	this.name = name;
	this.keyframes = [];
	this.nextPlayedKeyframe = 0;
	this.playing = false;
}

Animation.prototype.save = function() {
	var saveObj = {};
	saveObj.name = this.name;
	saveObj.keyframes = this.keyframes;
	return saveObj;
}

Animation.prototype.removeKeyframeByIndex = function(index) {
	if (index < 0 || index >= this.keyframes.length) {
		console.error("Can't remove keyframe at index " + index + ", out of bounds(" + index + ")");
	}
	this.keyframes.splice(index, 1);
}

Animation.prototype.removeKeyframeByID = function(id) {
	var index = this.getKeyframeIndexByID(id);
	if (index < 0) {
		console.error("Can't remove keyframe with id " + id + ", cannot find keyframe.");
		return;
	}
	this.keyframes.splice(index, 1);
}

Animation.prototype.getKeyframeByID = function(id) {
	for (var a = 0; a < this.keyframes.length; a++) {
		if (this.keyframes[a].id == id) return this.keyframes[a];
	}
	return null;
}

// get the keyframe just before the given time - it should always return at least the default keyframe(at time 0)
Animation.prototype.getClosestKeyframeBefore = function(time) {
	var lastKeyframe = null;
	for (var a = 0; a < this.keyframes.length; a++) {
		if (this.keyframes[a].time >= time) {
			return lastKeyframe;
		} else {
			lastKeyframe = this.keyframes[a];
		}
	}
	return lastKeyframe;	
}

Animation.prototype.getKeyframeIndexByID = function(id) {
	for (var a = 0; a < this.keyframes.length; a++) {
		if (this.keyframes[a].id == id) return a;
	}
	return -1;
}

// generate unique keyframe ID for this animation
Animation.prototype.generateKeyframeID = function() {
	var uniqueID = this.keyframes.length - 1;
	if (uniqueID < 0) uniqueID = 0;
	var found = true;
	if (this.keyframes.length > 0) {
		while (found) {
			found = false;
			for (var a = 0; a < this.keyframes.length; a++) {
				if (this.keyframes[a].id == uniqueID) {
					found = true;
					uniqueID++;
				}
			}
		}
	}
	console.log('generating UniqueID:' + uniqueID);
	return uniqueID;
}

Animation.prototype.duplicateKeyframeByIndex = function(index) {
	if (index < 0 || index >= this.keyframes.length) {
		console.error("Can't duplicate keyframe at index " + index + ", out of bounds(" + index + ")");
		return;
	}
	var copy = $.extend(true, {}, this.keyframes[index]);
	copy.time += 250;
	copy.id = this.generateKeyframeID();
	this.keyframes.push(copy);
	return copy;
}

Animation.prototype.duplicateKeyframeByID = function(id) {
	var keyframe = this.getKeyframeByID(id);
	if (keyframe == null) {
		console.error("Can't duplicate keyframe with ID " + id + ", a keyframe with this id wasn't found.");
		return;
	}
	var copy = $.extend(true, {}, keyframe);
	copy.time += 250;
	copy.id = this.generateKeyframeID();
	this.keyframes.push(copy);
	return copy;
}

Animation.prototype.updateKeyframeByID = function(id, animObject, replaceProps) {
	var keyframe = this.getKeyframeByID(id);
	for (var a = 0; a < replaceProps.length; a++) {
		console.log('replaceing prop ' + replaceProps[a] + ' : ' + animObject[replaceProps[a]]);
		keyframe.animObject[replaceProps[a]] = animObject[replaceProps[a]];
	}
}

Animation.prototype.load = function(saveObj) {
	this.name = saveObj.name;
	this.keyframes = saveObj.keyframes;
	var negativeFixOffset = 0;
	// generate id's for the old animations - TODO:erase, in new Visuala all keyframes have id's
	for (var a = 0; a < this.keyframes.length; a++) {
		if (!this.keyframes[a].hasOwnProperty('id')) {
			this.keyframes[a].id = a;
			console.log('ID not found on keyframe ' + a + ', so adding ' + a);
		} else {
			if (this.keyframes[a].id < 0) {
				console.log('negative ID found on keyframe ' + a + ', changing it to 0');
				negativeFixOffset = -1 * this.keyframes[a].id; 
				this.keyframes[a].id = 0;
			} else {
				// increase the id of the other keyframes too if the first one was negative (fix, this should be ok in the final release)
				this.keyframes[a].id += negativeFixOffset;
			}
		}
		if (!this.keyframes[a].animObject.hasOwnProperty('originX')) {
			console.log('originX not found on keyframe ' + a + ', so adding ' + a);
			this.keyframes[a].animObject.originX = '50%';
		}
		if (!this.keyframes[a].animObject.hasOwnProperty('originY')) {
			console.log('originY not found on keyframe ' + a + ', so adding ' + a);
			this.keyframes[a].animObject.originY = '50%';
		}
	}
}

Animation.prototype.getLastKeyframeTime = function() {
	if (this.keyframes.length > 0) {
		return this.keyframes[this.keyframes.length - 1].time;
	} else {
		return 0;
	}
}

// reset the animation so it can be ready to be played again (resets the keyframe flags etc)
Animation.prototype.resetKeyframes = function() {
	for (var c = 0; c < this.keyframes.length; c++) {
		this.keyframes[c].played = false;
	}
}

// stop the animation
Animation.prototype.stop = function() {
	this.playing = false;										
	this.nextPlayedKeyframe = 0;
	this.resetKeyframes();
}

// stop the animation
Animation.prototype.play = function() {
	this.playing = true;										
	this.nextPlayedKeyframe = 0;
	this.resetKeyframes();
}

// update or add a new animation keyframe
Animation.prototype.updateKeyframe = function(time, animObject, mode, replaceProps) {
	var keyframes = this.keyframes;
	var updated = false;
	if (mode == this.engine.TRY_REPLACE_KEYFRAME) {
		for (var b = 0; b < keyframes.length; b++) {			
			// update
			console.log("updateKeyframe at time " + time + ", type " + animObject.type + ", comparing with time " + keyframes[b].time + ", type " + keyframes[b].animObject.type);
			if (keyframes[b].time == time && keyframes[b].animObject.type == animObject.type) {
				// transformations
				if (animObject.type == "trns") {
					console.log("Replacing 'trns' keyframe");
					for (var a = 0; a < replaceProps.length; a++) {
						keyframes[b].animObject[replaceProps[a]] = animObject[replaceProps[a]];
					}
				} 
				// change of animations, replace or add new pair
				if (animObject.type == "anim") {
				}
				updated = true;								
			}
		}
	}
	// add new keyframe
	if (!updated) {
		// if there are no keyframes in this layer yet, add the default keyframe at frame 0, unless the new keyframe is also at frame 0
		var o = {};
		
		if (keyframes.length == 0 && time > 0) {
			this.addDefaultKeyframe();
			o.time = time;
			o.played = false;
			o.animObject = {};
			o.animObject.opacity = 1.0;
			o.animObject.scale = 1.0;
			o.animObject.rotate = 0;
			o.animObject.originX = '50%';
			o.animObject.originY = '50%';
			o.animObject.easing = 'linear';		
		} else {
			// if there are keyframes, then use the keyframe before this one as the "base" (we suppose we're gonna interleave from it rather than from point 0)
			var src = this.getClosestKeyframeBefore(time);
			if (src != null) {
				o.time = time;
				o.played = false;
				o.animObject = JSON.parse(JSON.stringify(src.animObject));
				console.log('using src animObject:' + JSON.stringify(src.animObject));
			} else {
				o.animObject = {};
				o.animObject.opacity = 1.0;
				o.animObject.scale = 1.0;
				o.animObject.rotate = 0;
				o.animObject.originX = '50%';
				o.animObject.originY = '50%';
				o.animObject.easing = 'linear';						
			}
		}		
		for (var a = 0; a < replaceProps.length; a++) {
			o.animObject[replaceProps[a]] = animObject[replaceProps[a]];
		}		
		o.id = this.generateKeyframeID();
		keyframes.push(o);	
		console.log('with replaced props:' + JSON.stringify(src.animObject));

//		console.log("Keyframes before sort:" + JSON.stringify(keyframes));
		keyframes.sort(this.engine.compare);		
//		console.log("Keyframes after sort:" + JSON.stringify(keyframes));
	}												
}

