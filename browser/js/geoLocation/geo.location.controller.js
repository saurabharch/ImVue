app.controller('geoLocationCtrl', function($scope, $log, geoLocationFactory){

    $scope.update = function(){
        console.log("calling update")
        navigator.geolocation.getCurrentPosition( (position) => {
            $scope.pos = position.coords;
            $scope.$evalAsync(); 
        })

    	// $scope.pos = geoLocationFactory.updateLocation().coords
    	// .then(function(position){
    	// 	$scope.pos = position.coords;
    	// })
     //    .catch($log)

     //    geoLocationFactory.updateOrientation()
    	// .then(function(heading){
     //        // trueHeading doesn't work for iphone
     //        // reading about android it just returns magnetic for true
    	// 	$scope.heading = heading.magneticHeading;
    	// })
    	// .catch($log)

	    
    }

});