app.controller('ViewCtrl', function($stateParams, CanvasFactory, DrawingFactory, TextFactory){

	CanvasFactory.initializeCanvas(window, document);
	
	if ($stateParams.project.drawing){
		DrawingFactory.drawDrawingsOnCanvas([$stateParams.project.drawing])
	}
	if ( $stateParams.project.text ){
		TextFactory.drawTextsOnCanvas([$stateParams.project.text])
	}

});
