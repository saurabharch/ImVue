app.controller('geoLocationCtrl', function($scope, $log, geoLocationFactory){

    $scope.update = function(){
        navigator.geolocation.getCurrentPosition( (position) => {
            $scope.pos = position.coords;
            $scope.$evalAsync();
        })
    }

    var deviceOrientationListener = function (event) {
        //alpha: ANGLE, beta: TILTING
        $scope.angle = Math.round(event.alpha);
        $scope.tilt = Math.round(event.beta);
    }

    window.addEventListener('deviceorientation', deviceOrientationListener);

});
