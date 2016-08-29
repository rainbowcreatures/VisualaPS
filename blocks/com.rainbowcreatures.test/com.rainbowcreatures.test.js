/**
 * VisualaPS example block.
 * This shows how to develop custom blocks for VisualaPS
 * 
 * For more check out Google Blockly documentation at https://developers.google.com/blockly/
 *
 */

'use strict';

goog.provide('Blockly.Blocks.com.rainbowcreatures.test');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.com.rainbowcreatures.test.HUE = 30;

Blockly.Blocks['com.rainbowcreatures.test.testBlock'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */

  init: function() {
    this.jsonInit({
      "message0": "Testing external block, say %1!",
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT",
	  "check": "String"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null
    });
    this.setColour(Blockly.Blocks.com.rainbowcreatures.test.HUE);       
    this.setTooltip('This a plugin block. You can develop your own for yourself or other VisualaPS users to download!');
  }
};

