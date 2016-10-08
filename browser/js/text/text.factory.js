app.factory('TextFactory', function(){

	var ctx;

	function initializeTextFactory(canvasCtx){
		ctx = canvasCtx;
	}

	function getTextSizes(){ 
		return textSizes(); 
	}

	function getFontFamilies(){ 
		return fontFamilies(); 
	}

	function drawText( size, font, color, locX, locY, text){
		ctx.font =  size + 'px ' + font;
        ctx.fillStyle = color;
        ctx.fillText(text, locX, locY);
	}

	return {
		initializeTextFactory: initializeTextFactory,
		drawText: drawText,
		getTextSizes: getTextSizes,
		getFontFamilies: getFontFamilies,
	}

});

/* ------------- TEXT SIZES ------------- */

function textSizes(){

	let minTextSize = 50;
	let maxTextSize = 150;
	let textIncrementSize = 10;
	let textSizes = [];

	for( let i = minTextSize; i <= maxTextSize; i += textIncrementSize){
		textSizes.push(i);
	}

	return textSizes;
}

/* ------------- FONT FAMILIES ------------- */

function fontFamilies(){
	return [
		'Arial',
		'Verdana',
		'Times New Roman',
		'Courier New',
		'serif',
		'sans-serif'
	]
}
