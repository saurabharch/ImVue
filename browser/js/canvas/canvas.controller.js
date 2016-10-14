app.controller('CanvasCtrl', function(CanvasFactory, ImageFactory, $scope){

	CanvasFactory.initializeCanvas(window, document);
	CanvasFactory.loadCanvasContent();

	$scope.clearCanvas = CanvasFactory.clearCanvas

	$scope.undo = CanvasFactory.undoLast

	$scope.loadImg = () => {
		ImageFactory.loadSelectedImageOnCanvas($scope.image);
	}

    $scope.saveCanvas = CanvasFactory.saveCanvasContent

    $scope.toggleImageSelect = ImageFactory.toggleImageSelect
    $scope.showImageSelect = ImageFactory.showImageSelect

	var drawingPlace = document.getElementById('paint')
    var tiltPlace = document.getElementById('tiltCanvas')
    var videoPlace = document.getElementById('videoElement')

    var height = window.innerHeight
    var width = window.innerWidth

    drawingPlace.style.height = height + 'px'
    drawingPlace.style.width = width + 'px'
    drawingPlace.height = height
    drawingPlace.width = width

    if (tiltPlace){
        tiltPlace.style.height = height + 'px'
        tiltPlace.style.width = width + 'px'
        tiltPlace.height = height
        tiltPlace.width = width
    }

    videoPlace.style.height = height + 'px'
    videoPlace.style.width = width + 'px'
    videoPlace.height = height
    videoPlace.width = width

});
