app.controller('SketchCtrl', function($scope, SketchFactory) {


	SketchFactory.initialize(window, document)

	$scope.savePng = function(){
		SketchFactory.saveImg()
	}

	$scope.loadPng = function(){
		SketchFactory.loadImg()
	}

	$scope.toggleColors = function(){
		if ($scope.showColors){
			$scope.showColors = false
		} else {
			$scope.showColors = true
		}
	}

	$scope.showColors = false

});
