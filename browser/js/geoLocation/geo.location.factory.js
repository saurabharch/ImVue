app.factory('geoLocationFactory', function () {

    var geoLocationFactory = {}

    geoLocationFactory.updateLocation = new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve)
    })

    return geoLocationFactory;

});