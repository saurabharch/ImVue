app.factory('TextFactory', function(){

	let ctx;
	let texts = [];

	function initializeTextFactory(canvasCtx){
		ctx = canvasCtx;
	}

	function getTextSizes(){
		return fetchTextSizes();
	}

	function getFontFamilies(){
		return fetchFontFamilies();
	}

	function saveTexts(){
		let holdTexts = texts;
		texts = [];
		return holdTexts;
	}

	function drawText( size, font, color, locX, locY, content){
		ctx.font =  size + 'px ' + font;
        ctx.fillStyle = color;
        ctx.fillText(content, locX, locY);

        texts.push({size: size, font: font, color: color, x: locX, y: locY, content: content})
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
		saveTexts: saveTexts,
		getTextSizes: getTextSizes,
		getFontFamilies: getFontFamilies,
		//getTextLocations: getTextLocations
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

function fetchTextLocations(){

	let top = 0;
	let centerV = 200;
	let bottom = 400;

	let left = 0;
	let centerH = 100;
	let right = 400;

	return [
		{ locString: 'top-left', 		locCoords: 	{x: top, y: left } },
		{ locString: 'top-center', 		locCoords: 	{x: top, y: centerH } },
		{ locString: 'top-right', 		locCoords: 	{x: top, y: right } },
		{ locString: 'center-left', 	locCoords: 	{x: centerV, y: left  } },
		{ locString: 'center-center', 	locCoords: 	{x: centerV, y: centerH } },
		{ locString: 'center-right', 	locCoords: 	{x: centerV, y: right } },
		{ locString: 'bottom-left', 	locCoords: 	{x: bottom, y: left } },
		{ locString: 'bottom-center', 	locCoords: 	{x: bottom, y: centerH } },
		{ locString: 'bottom-right', 	locCoords: 	{x: bottom, y: right } },
	]
}
