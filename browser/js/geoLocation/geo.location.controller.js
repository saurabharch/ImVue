app.controller('geoLocationCtrl', function($scope, $log, geoLocationFactory, SketchFactory, $http){

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

    $scope.fetchDrawings = function () {
        console.log('fetching drawings');
        // $http.get(`/locations/ping/${$scope.pos.longitude}/${$scope.pos.latitude}`)//real
        var testLon = -74.0086208;
        var testLat = 40.704906;
        $http.get(`/api/locations/ping/${testLon}/${testLat}`)//test
            .then(drawings => {
                var data = drawings.data;
                console.log('We found ' + data.length + ' drawings around you!');
                console.log(data[0])
                console.log(data[0].id);
                // return SketchFactory.loadImg();
            })
            //TODO: sending these images and putting on the canvas
    }
});

