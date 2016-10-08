app.controller('TextCtrl', function($scope, TextFactory){

	let textSizes = TextFactory.getTextSizes();
	let fontFamilies = TextFactory.getFontFamilies();

	$scope.getTextSizes = () => textSizes;

	$scope.getFontFamilies = () => fontFamilies;

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
