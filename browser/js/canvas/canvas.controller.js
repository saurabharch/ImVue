app.controller('CanvasCtrl', function(CanvasFactory, ImageFactory, $scope){

	CanvasFactory.initializeCanvas(window, document);
	CanvasFactory.loadCanvasContent();

	$scope.clearCanvas = CanvasFactory.clearCanvas

	$scope.undo = CanvasFactory.undoLast

	$scope.loadImg = () => {
		ImageFactory.loadSelectedImageOnCanvas($scope.image);
	}

	var drawingPlace = document.getElementById('paint')
    var videoPlace = document.getElementById('videoElement')

    var h = window.innerHeight
    var w = window.innerWidth

    drawingPlace.style.height = h + 'px'
    drawingPlace.style.width = w + 'px'
    drawingPlace.height = h
    drawingPlace.width = w

});
