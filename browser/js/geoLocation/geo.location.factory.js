app.factory('geoLocationFactory', function(){

    var geoLocationPos;

    var geoLocationFactory = {}

    geoLocationFactory.updateLocation = () => {
         navigator.geolocation.getCurrentPosition( position => { geoLocationPos = position } )
         return geoLocationPos
    }

    return geoLocationFactory;

});
