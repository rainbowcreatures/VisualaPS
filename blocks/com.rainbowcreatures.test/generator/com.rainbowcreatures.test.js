/**
 * VisualaPS example block.
 * This shows how to develop custom blocks for VisualaPS
 * 
 * For more check out Google Blockly documentation at https://developers.google.com/blockly/
 *
 */

'use strict';

goog.provide('Blockly.JavaScript.com.rainbowcreatures.test');

goog.require('Blockly.JavaScript');

Blockly.JavaScript['com.rainbowcreatures.test.testBlock'] = function(block) {
	var TEXT = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || '\'\'';
	return "alert(" + TEXT + ");\n";
}
