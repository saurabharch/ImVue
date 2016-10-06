app.controller('SketchCtrl', function($scope, SketchFactory) {

	SketchFactory.initialize(window, document)

	$scope.savePng = function(){
		SketchFactory.saveImg()
	}

	$scope.loadPng = function(){
		SketchFactory.loadImg()
	}

});
