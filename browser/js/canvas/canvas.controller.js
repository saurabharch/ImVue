app.controller('CanvasCtrl', function(CanvasFactory, ImageFactory, $scope){

	CanvasFactory.initializeCanvas(window, document);
	CanvasFactory.loadCanvasContent();

	$scope.clearCanvas = CanvasFactory.clearCanvas

	$scope.undo = CanvasFactory.undoLast

	$scope.loadImg = () => {
		ImageFactory.loadImageOnCanvas($scope.image);
	}

    $scope.saveCanvas = CanvasFactory.saveCanvasContent

    $scope.toggleImageSelect = ImageFactory.toggleImageSelect
    $scope.showImageSelect = ImageFactory.showImageSelect

	var drawingPlace = document.getElementById('paint')
    var videoPlace = document.getElementById('videoElement')
    var sidebar = document.getElementById('teste')

    var h = window.innerHeight
    var w = window.innerWidth

    drawingPlace.style.height = h + 'px'
    drawingPlace.style.width = w + 'px'
    drawingPlace.height = h
    drawingPlace.width = w

    videoPlace.style.height = h + 'px'
    videoPlace.style.width = w + 'px'
    videoPlace.height = h
    videoPlace.width = w

});
