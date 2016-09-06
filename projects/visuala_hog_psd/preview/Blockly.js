var varItemID;
var name2;
var result;
var tableContent;
var audioVolume;
var collectedItemsCount;
var rowContent;
var menuShown;
var collectedItems;
var options;
var itemID;
var itemNameLayer;
var itemNameLayerX;
var itemNameLayerY;
var itemIndex;
var cellsRow;
var itemName;
var assignedItemText;

// Don't think about this too hard, it is just utility code for the storage to work
var StorageDefClass = function() {
	this.storage = {};
}
StorageDefClass.prototype.set = function(name, value) {
	this.storage[name] = value;
}
StorageDefClass.prototype.get = function(name) {
	return this.storage[name];
}
StorageDefClass.prototype.saveToFile = function() {
	var storageJSON = JSON.stringify(this.storage);
	if (window.localStorage) {
		console.log('Local storage saving: ' + storageJSON);
		localStorage.setItem('storage', storageJSON);
	} else {
		console.log('Local storage not supported!');
	}
}
StorageDefClass.prototype.loadFromFile = function() {
	if (window.localStorage) {
		console.log('Local storage loading: ' + localStorage.getItem('storage'));
		if (localStorage.key('storage'))
		this.storage = JSON.parse(localStorage.getItem('storage'));
	} else {
		console.log('Local storage not supported!');
	}
}
var StorageDef = new StorageDefClass();

function loadGame() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  // LOAD GAME
  // -------------------
  // We are loading the collected items from previous game

  StorageDef.loadFromFile();
  collectedItems = StorageDef.get('collectedItems');
  options = StorageDef.get('options');
  if (collectedItems == undefined) {
    // If it doesn't exist, we just create an empty list for collectedItems, so
    // we have a place to store the items.

    collectedItems = [];
  }
  if (options == undefined) {
    options = [];
  } else {
    audioVolume = options[0];
    applyAudioVolume();
  }
  // It's time to load all collectedItems from storage .

  itemIndex = 1;
  while (itemIndex <= collectedItems.length) {
  if (--window.LoopTrap == 0) throw "Infinite loop.";
    // ...get each item's ID...

    itemID = collectedItems[itemIndex - 1];
    itemIndex = (typeof itemIndex == 'number' ? itemIndex : 0) + 1;
    // hide the items we already collected

    hideItem(itemID);
  }
  $('#loading_screen_151').velocity({ opacity: 0 }, { display: "none", mobileHA: false });
}

function checkIfGameWon() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  result = 0;
  collectedItemsCount = collectedItems.length;
  if (collectedItemsCount == 4) {
    result = 1;
  }
  return result;
}

function showAllThings() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('img:datafind(properties.' + 'id' + '==' + '' + '),div:datafind(properties.' + 'id' + '==' + '' + ')').velocity({ opacity: 1 }, { visibility: "visible", mobileHA: false });
  $('.thing').each(function() {
  $(this).css('top', $(this).data('properties_private')['top']);
   $(this).css('left', $(this).data('properties_private')['left']);
  }).velocity({ opacity: 1 }, { display: "block", mobileHA: false });
}

function hideItem(varItemID) {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  // This function has two parts. First part hides the thing itself, the other part hides the thing name in the UI list.

  $('img:datafind(properties.' + 'id' + '==' + varItemID + '),div:datafind(properties.' + 'id' + '==' + varItemID + ')').hide();
  $(String('#itemName_') + String(varItemID)).velocity({ opacity: 0 }, { visibility: "hidden", mobileHA: false });
}

function listThings() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  tableContent = '';
  rowContent = '';
  $('#UI_bg_63').html('')
  $('#UI_bg_63').css("font-family", "mvboli_ttf");
  $('.thing').each(function() {
    // Inspect all layers with layer class "thing", then get their property called
    // itemName, and put it into variable called itemName.

    cellsRow = 0;
    itemName = $(this).data('properties')['itemName'];
    itemID = String('itemName_') + String($(this).data('properties')['id']);
    if (cellsRow < 3) {
      // If we are below the limit for table cells per row, to rowContent add a new table cell, which contains
      // dynamic layer, which contains the name of our hidden object. That way all names are added one
      // by one to the item table on the bottom of the screen and if you inspect this in a web browser you'll
      // see it actually creates HTML table with rows an cells.

      rowContent = String(rowContent) + String('<td>' + '<div id="' + itemID + '" class="' + '' + '" style="' + 'width:50px;color:#fff;font-size:18px;margin-left:50px' + '">' + itemName + '</div>' + '</td>');
      cellsRow = (typeof cellsRow == 'number' ? cellsRow : 0) + 1;
    } else {
      // When we reach the maximum count of table cells per row (that is defined in the if condition), create table
      // row and set its content to the variable "rowContent" which will be full of table cells we added above.

      tableContent = String(tableContent) + String('<tr>' + rowContent + '</tr>');
      rowContent = '';
      cellsRow = 0;
    }

  });
  if (cellsRow > 0) {
    tableContent = String(tableContent) + String('<tr>' + rowContent + '</tr>');
  }
  appendUIContent('<table id="' + '' + '" class="' + '' + '" style="' + '' + '">' + tableContent + '</table>');
}

function hideMainMenu() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('#main_menu_90').velocity({ opacity: 0 }, { display: "none", mobileHA: false }).hide();
  $('#won_screen_124').hide();
  menuShown = 'false';
}

function showMainMenu() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('#main_menu_90').show().velocity({ opacity: 1 }, { display: "block", mobileHA: false });
  menuShown = 'true';
}

function hideOptionsMenu() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('#options_menu_101').velocity({ opacity: 0 }, { display: "none", mobileHA: false }).hide();
}

function showOptionsMenu() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('#options_menu_101').show().velocity({ opacity: 1 }, { display: "block", mobileHA: false });
}

function appendUIContent(name2) {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('#UI_bg_63').append(name2);
}

function saveGame() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  StorageDef.set('collectedItems',collectedItems);
  StorageDef.saveToFile();
}

function applyAudioVolume() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  $('#' + 'audio').jWebAudio('options', { 'volume': Number(audioVolume)  *  Number(100) });
}

function updateAudioVolume() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  audioVolume = $('#audio_slider_108').visualaSlider("value");
}

function saveAudioVolume() {
if (--window.LoopTrap == 0) throw "Infinite loop.";
  options[0] = audioVolume;
  StorageDef.set('options',options);
  StorageDef.saveToFile();
}


// GAME START
// --------------------
// This executes on app start, we try to load
// a previously saved game and hide the
// already found objects.

$(document).ready(function() {
  $('body').append('<div id="' + 'audio' + '"></div>');
  $('#' + 'audio').jWebAudio('addSoundSource', { 'url': 'data/music.ogg', 'preLoad': true, 'loop': true, 'callback': function() {
     $('#' + 'audio').jWebAudio('play');
    listThings();
    loadGame();

  }
  });

});

// CLICK ON HIDDEN OBJECT
// -----------------------------------------
// Manage clicking on the hidden object layer

$(document).ready(function() {
  $('.thing').on(clickdown, function() {
    // Get its id property and save it to variable itemID

    itemID = $(this).data('properties')['id'];
    itemNameLayer = $(String('#itemName_') + String(itemID));
    itemNameLayerX = itemNameLayer.offset().left;
    ;
    itemNameLayerY = itemNameLayer.offset().top;
    ;
    $(this).data('properties')['itemText'] = itemNameLayer;
    $(this).velocity({
      left: itemNameLayerX,
      top: itemNameLayerY,
      opacity: 0, },
     { duration: 2000,
    complete: function() {
      assignedItemText = $(this).data('properties')['itemText'];
      $(this).hide();
      assignedItemText.velocity({ opacity: 0 }, { visibility: "hidden", mobileHA: false });
      // After we selected the id and faded the object layer out, we'll create the corresponding object name
      // inside the UI. The name has the objects ID attached at the end - thats how we know which name
      // belongs to which hidden object. We managed this when we created the table cell and dynamic layer's
      // ID inside it.

      // Remember the collected item, so we can save the game state

      collectedItems.push(itemID);
      saveGame();
      if (checkIfGameWon()) {
        $('#won_screen_124').velocity({ opacity: 1 }, { display: "block", mobileHA: false });
      }

    }
    , mobileHA: false
    });

  });

});

// MAIN MENU
// ------------------
// Clicking on menu buttons, showing / hiding panels etc.

$(document).ready(function() {
  menuShown = 'false';
  $('#button_menu_87').on(clickdown, function() {
    if (menuShown == 'false') {
      showMainMenu();
    } else {
      hideMainMenu();
      hideOptionsMenu();
    }

  });
  $('#button_new_game_93').on(clickdown, function() {
    collectedItems = [];
    listThings();
    showAllThings();
    hideMainMenu();

  });
  $('#button_load_game_94').on(clickdown, function() {
    collectedItems = [];
    listThings();
    showAllThings();
    loadGame();
    hideMainMenu();

  });
  $('#button_save_game_95').on(clickdown, function() {
    saveGame();
    hideMainMenu();
    window.alert('Game was saved.');

  });
  $('#button_options_99').on(clickdown, function() {
    hideMainMenu();
    showOptionsMenu();
    menuShown = 'true';
    $('#audio_slider_108').visualaSlider({ elementRail:$('#audio_slider_bg_107'), elementHandle:$('#audio_slider_drag_110'), axis:'x',
     start: function() {

    },
     drag: function() {
      updateAudioVolume();
      applyAudioVolume();

    },
     stop: function() {
      saveAudioVolume();

    }
    }).visualaSlider("value", audioVolume);

  });

});

// OPTIONS MENU
// ------------------------

$(document).ready(function() {
  $('#button_back_104').on(clickdown, function() {
    hideOptionsMenu();
    showMainMenu();

  });

});

