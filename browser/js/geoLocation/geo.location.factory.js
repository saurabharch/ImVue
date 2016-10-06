

app.factory('geoLocationFactory', function($http, $log){

	// var posOptions = {timeout: 10000, enableHighAccuracy: true};
    // var posOptions = {enableHighAccuracy: true};
    var watchOptions = {timeout: 500, enableHighAccuracy: true};
    var geoLocationPos;

    var geoLocationFactory = {}

    geoLocationFactory.updateLocation = () => {
         navigator.geolocation.getCurrentPosition( position => geoLocationPos = position )
         return geoLocationPos
    }
    // geoLocationFactory.updateOrientation = () => {
    //     return $cordovaDeviceOrientation.getCurrentHeading()
    //         .then( heading => heading )
    //         .catch($log)
    // }

    return geoLocationFactory;

})