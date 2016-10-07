app.factory('geoLocationFactory', function () {

    var geoLocationPos;

    var geoLocationFactory = {}

    // geoLocationFactory.updateLocation = () => {
    //      navigator.geolocation.getCurrentPosition( position => { geoLocationPos = position } )
    //      return geoLocationPos
    // }

    geoLocationFactory.updateLocation = function() {
        return new Promise(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition( position => position );
        })
    }

    return geoLocationFactory;

});