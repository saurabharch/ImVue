app.controller('MapCtrl', function ($scope, geoLocationFactory) {

  var map;
  // var pos;

  // .then(pos => console.log(pos));

  function initMap() {
    geoLocationFactory.updateLocation
      .then(function (position) {
        return position.coords
      })
      .then(function (coords) {
        var currentPos = { lat: coords.latitude, lng: coords.longitude }

        var myStyles =[
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                      { visibility: "off" }
                ]
            }
        ];

        map = new google.maps.Map(document.getElementById('map'), {
          center: currentPos,
          zoom: 17
        })

        var marker = new google.maps.Marker({
          position: currentPos,
          map: map,
          title: 'Current Location',
          styles: myStyles
        })
      })
  }
  initMap();

});