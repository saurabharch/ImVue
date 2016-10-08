app.factory('TextFactory', function(){

	var ctx;

	function initializeTextFactory(canvasCtx){
		ctx = canvasCtx;
	}

	function getTextSizes(){
		return fetchTextSizes();
	}

	function getFontFamilies(){
		return fetchFontFamilies();
	}

	function drawText( size, font, color, locX, locY, text){
		ctx.font =  size + 'px ' + font;
        ctx.fillStyle = color;
        ctx.fillText(text, locX, locY);
	}

	function drawTextsOnCanvas(texts){
		texts.forEach( text => {
			drawText( text.size, text.font, text.color, text.x, text.y, text.content )
		})
	}

	return {
		initializeTextFactory: initializeTextFactory,
		drawText: drawText,
		drawTextsOnCanvas: drawTextsOnCanvas,
		getTextSizes: getTextSizes,
		getFontFamilies: getFontFamilies,
	}

});

/* ------------- TEXT SIZES ------------- */

function fetchTextSizes(){

	let minTextSize = 50;
	let maxTextSize = 150;
	let textIncrementSize = 10;
	let textSizes = [];

	for ( let i = minTextSize; i <= maxTextSize; i += textIncrementSize){
		textSizes.push(i);
	}

	return textSizes;
}

/* ------------- FONT FAMILIES ------------- */

function fetchFontFamilies(){
	return [
		'Arial',
		'Verdana',
		'Times New Roman',
		'Courier New',
		'serif',
		'sans-serif'
	]
}
