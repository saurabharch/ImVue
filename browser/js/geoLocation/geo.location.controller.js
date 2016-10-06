app.controller('geoLocationCtrl', function($scope, $log, geoLocationFactory, $http){

    $scope.update = function(){
        console.log("calling update")
        navigator.geolocation.getCurrentPosition( (position) => {
            $scope.pos = position.coords;
            $scope.$evalAsync();
        })
    }

    var deviceOrientationListener = function (e) {
        //alpha: ANGLE, beta: TILTING
        $scope.angle = Math.round(e.alpha);
        $scope.tilt = Math.round(e.beta);
    }

    window.addEventListener('deviceorientation', deviceOrientationListener);


    $scope.fetchDrawings = function () {
        // $http.get(`/locations/ping/${$scope.pos.longitude}/${$scope.pos.latitude}`)//real
        var testLon = 40;
        var testLat = -70;
        $http.get(`/locations/ping/${testLon}/${testLat}`)//test
            .then(drawings => {
                alert("We found " + drawings.length + ' drawings around you!');
                console.log("We found " + drawings.length + ' drawings around you!');
            })
            //TODO: sending these images and putting on the canvas
    }
});