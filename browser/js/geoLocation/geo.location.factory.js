app.factory('geoLocationFactory', function () {

    var geoLocationFactory = {}

    geoLocationFactory.updateLocation = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
        navigator.geolocation.getCurrentPosition(resolve)
    })

    return geoLocationFactory;

});
