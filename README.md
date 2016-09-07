# VisualaPS

Plugin blocks and example projects for VisualaPS. 

##Blocks

These blocks extend the basic blocks available in VisualaPS. 

*Are you JS developer and interested in helping out non-developers to build apps super easily in Photoshop?*
Add your own blocks to the project! Please submit an issue before sending a pull request, describing what your extension is about. 

Once VisualaPS goes out of alpha, a block market will become availabe with the possibility of commercial blocks for developers - you can make a headstart now, by collaborating on this project.

## Installing plugin blocks

Simply unzip the blocks content into C:\Documents and Settings\<username>\AppData\Roaming\VisualaPS\blocks\. A better UI system will be developed for installing blocks from the block market later on.

## Creating plugin blocks

The Blockly language was developed by Google, for more information and samples of custom blocks check out Google Blockly documentation at https://developers.google.com/blockly/
You can also check out the wiki (still under construction at this point) http://visualaps.com/wiki/

- Create a folder in "blocks" folder described above, with reverse domain name of your company / organization. For example "com.rainbowcreatures" and add project name to it, for example "projectname". In general, your blocks "project" theme should be unified / serve one general purpose to avoid confusion among VisualaPS users.
- Create a JS file inside the project folder, keeping the same reverse domain naming convention, ie "com.rainbowcreatures.projectname.js". This file will serve as the base Blockly file.
- Create folder called "generator" inside your project folder, and place another JS filename with the same name like above, ie "com.rainbowcreatures.projectname.js" into it. This will be your Blockly "generator" file (this will generate the JavaScript sourcecode for your blocks).
- Finally, in the root of your project folder, create a json descriptor file in the same format as all the folders / files above, ie "com.rainbowcreatures.projectname.json". This will describe your blocks project - the format of the file is currently:

```javascript
{
  "author":"Your name", 
  "version":"X.X", 
  "title":"Project title", 
  "blocks":
  [
    {"type":"com.rainbowcreatures.test.testBlock", "name":"Test block"}, 
    {"type":"com.rainbowcreatures.test.anotherTestBlock", "name":"Another test block"}
  ]
}
```

The "blocks" array needs to contain all the blocks type names you wish to include into the VisualaPS Blockly menu.

After reloading VisualaPS panels the included blocks should appear under the "Plugins" left sidebar menu of the Blockly (visual code) panel.
