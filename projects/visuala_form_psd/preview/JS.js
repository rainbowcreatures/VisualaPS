// Here's your "regular" JS code, if you're a pro you might just use this!

// Resize stage accordingly
var contentWidth = 0;
var contentHeight = 0;
var iframe;
var div;
var body;

function updateScale(windowWidth, windowHeight) {
    var contentWidthNew = contentWidth;
    var contentHeightNew = contentHeight;
    var scaleX = 1;
    if (contentWidthNew > windowWidth) {
		scaleX = windowWidth / contentWidthNew;
		contentWidthNew *= scaleX;
		contentHeightNew *= scaleX;		
    }
    var scaleY = 1;
    if (contentHeightNew > windowHeight) {
		scaleY = windowHeight / contentHeightNew;
		contentWidthNew *= scaleY;
		contentHeightNew *= scaleY;
    }
    // scale our own iframe
    var scale = scaleX * scaleY;

    iframe.css({"width": contentWidthNew / scale});
    iframe.css({"height": contentHeightNew / scale});

    // scale and move the iframe
    iframe.css({"transform": "scale(" + scale + ")" });
    iframe.css({"transform-origin": "0% 0%" });
    iframe.css({"left":((windowWidth)/ 2) - ((contentWidthNew) / 2)});
    iframe.css({"top":((windowHeight)/ 2) - ((contentHeightNew) / 2)}); 
}

$(document).ready(function() {
	iframe = $('#iframe', window.parent.document);
	div = $(document).find("div:first");
	body = $(document).find("body");
        contentWidth = (div.css('width'));
        contentHeight = (div.css('height'));
        contentWidth = (parseInt(contentWidth));
    	contentHeight = (parseInt(contentHeight));
        iframe.css({"with": contentWidth});
        iframe.css({"height": contentHeight});
});