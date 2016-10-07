app.controller('TextCtrl', function($scope, TextFactory){
	$scope.textInput = "Text"
	$scope.showInput = function(){
		return true;
	}
	$scope.addText = function(){
		TextFactory.drawText( $scope.fontSize, $scope.fontFamly, 'red', 300, 500, $scope.textInput)
	}


	$scope.chooseFont = function() {
		var fontFamily = $scope.fontFamily;
	}
});
