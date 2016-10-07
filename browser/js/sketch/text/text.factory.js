app.factory('textFactory', function(){

	var ctx;

	function initializeTextFactory(canvasCtx){
		ctx = canvasCtx;
	}

	function drawText( size, font, color, locX, locY, text){
		ctx.font =  size + 'px ' + font;
        ctx.fillStyle = color;
        ctx.fillText(text, locX, locY);
	}

	return {
		initializeTextFactory: initializeTextFactory,
		drawText: drawText,
	}

});
