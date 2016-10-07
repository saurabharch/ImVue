app.controller('TextCtrl', function($scope, TextFactory){
	$scope.textInput = "Text"
	$scope.showInput = function(){
		return true;
	}
	$scope.addText = function(text){
		console.log(text)
		TextFactory.drawText( 72, 'serif', 'red', 300, 500, text)
	}
});
