app.controller('CanvasCtrl', function(CanvasFactory){

	CanvasFactory.initializeCanvas(window, document);
	CanvasFactory.loadCanvasContent();
});
