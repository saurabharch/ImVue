app.controller('CameraCtrl', function($scope, CameraFactory){
	CameraFactory.streamCamera()
});
