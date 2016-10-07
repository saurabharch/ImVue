app.controller('MapCtrl', function($scope, geoLocationFactory) {

  var map;
  var pos;



    // .then(pos => console.log(pos));

  function initMap(){

    geoLocationFactory.updateLocation()
    .then(function(position) {

      pos = position;
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.704906, lng: -74.0086208},
      zoom: 15
    })
    })
    console.log(pos);

  }


    initMap()

});
