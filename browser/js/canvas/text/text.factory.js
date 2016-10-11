app.factory('TextFactory', function(){

	let ctx;
	let texts = [];

	let textSizes = fetchTextSizes();
	let fontFamilies = fetchFontFamilies();
	let textLocations = fetchTextLocations();

	function initializeTextFactory(canvasCtx){
		ctx = canvasCtx;
	}

	function saveTexts(){
		let holdTexts = texts;
		texts = [];
		return holdTexts;
	}

	function drawText( size, font, color, locX, locY, content){
		console.log( [size, font, color, locX, locY, content].join(' ') )
		ctx.font =  size + 'px ' + font;
        ctx.fillStyle = color;
        ctx.fillText(content, locX, locY);

        texts.push({size: size, font: font, color: color, x: locX, y: locY, content: content}) // eslint-disable-line id-length
	}

	function drawTextsOnCanvas(textsToDraw){
		textsToDraw.forEach( text => {
			drawText( text.size, text.font, text.color, text.x, text.y, text.content )
		})
	}

	return {
		initializeTextFactory: initializeTextFactory,
		drawText: drawText,
		drawTextsOnCanvas: drawTextsOnCanvas,
		saveTexts: saveTexts,
		getTextSizes: textSizes,
		getFontFamilies: fontFamilies,
		getTextLocations: textLocations
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

	console.log(screen)

	let top = 			screen.availWidth * 0.1 ;
	let centerVert = 	screen.availWidth * 0.5;
	let bottom = 		screen.availWidth * 0.9;

	let left = 			screen.availHeight * 0.1;
	let centerHor = 	screen.availHeight * 0.5;
	let right = 		screen.availHeight * 0.9;

	return [ /*eslint-disable id-length*/
		{ locString: 'top-left', 		locCoords: 	{ x: top, y: left } },
		{ locString: 'top-center', 		locCoords: 	{ x: top, y: centerHor } },
		{ locString: 'top-right', 		locCoords: 	{ x: top, y: right } },
		{ locString: 'center-left', 	locCoords: 	{ x: centerVert, y: left  } },
		{ locString: 'center-center', 	locCoords: 	{ x: centerVert, y: centerHor } },
		{ locString: 'center-right', 	locCoords: 	{ x: centerVert, y: right } },
		{ locString: 'bottom-left', 	locCoords: 	{ x: bottom, y: left } },
		{ locString: 'bottom-center', 	locCoords: 	{ x: bottom, y: centerHor } },
		{ locString: 'bottom-right', 	locCoords: 	{ x: bottom, y: right } },
	]		/*eslint-enable id-length*/
}
