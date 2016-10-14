app.controller('CameraCtrl', function($scope, CameraFactory){
	CameraFactory.streamCamera()
	$scope.toggleCameraOptions = CameraFactory.toggleCameraOptions
	$scope.showCameraOptions = CameraFactory.showCameraOptions
});
