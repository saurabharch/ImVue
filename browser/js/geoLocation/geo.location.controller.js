app.controller('geoLocationCtrl', function($scope, $log, geoLocationFactory, SketchFactory, $http){

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
        console.log('fetching drawings');
        // $http.get(`/locations/ping/${$scope.pos.longitude}/${$scope.pos.latitude}`)//real
        var testLon = -74.0086208;
        var testLat = 40.704906;
        $http.get(`/api/locations/ping/${testLon}/${testLat}`)//test
            .then(drawings => {
                var d = drawings.data;
                alert("We found " + d.length + ' drawings around you!');
                console.log(d[0])
                console.log(d[0].id);
                // return SketchFactory.loadImg();
            })
            //TODO: sending these images and putting on the canvas
    }
});