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

        $http.get(`/api/locations/ping/${$scope.pos.longitude}/${$scope.pos.latitude}`)
        .then( drawings => {
                var data = drawings.data;
                if (data.length === 0) {
                    console.log('we found nothing!');
                    return;
                } else {
                    console.log('We found ' + data.length + ' drawings around you!');
                    console.log(data[0])
                    console.log(data[0].id);
                    return SketchFactory.loadImg(data[0].id)
                }
            })
            .catch($log)
    }
});

