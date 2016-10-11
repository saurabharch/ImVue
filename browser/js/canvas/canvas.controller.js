app.controller('CanvasCtrl', function(CanvasFactory, $scope){

	CanvasFactory.initializeCanvas(window, document);
	CanvasFactory.loadCanvasContent();

	$scope.clearCanvas = CanvasFactory.clearCanvas

	$scope.undo = CanvasFactory.undoLast

});
