app.controller('MapCtrl', function ($scope, geoLocationFactory, mapFactory, $http, localProjects) {


  $scope.allProjects = localProjects;
  var map;
  var drawingArr = [];

  function createMarker(pos, title) {
    var newMarker = new google.maps.Marker({  // eslint-disable-line no-undef
      position: pos,
      map: map,
      title: title,
      mapTypeControl: false
    });
    return newMarker;
  }

  function initMap(latPos, lngPos) {

    map = new google.maps.Map(document.getElementById('map'), { // eslint-disable-line no-undef
        center: { lat: latPos, lng: lngPos},
        zoom: 25
    });

      (function (drawings) {


        for (var i = 0; i < drawings.data.length; i++) {

          var pos = {
            lat: drawings.data[i].latitude,
            lng: drawings.data[i].longitude
          };
          var title = 'title: ' + drawings.data[i].id;
          var infowindow = new google.maps.InfoWindow({ // eslint-disable-line no-undef
            content: title
          });

          var marker = {
            pos: pos,
            title: title,
            infoWindow: infowindow
          }

          drawingArr.push(marker);
        }

          var newMarker
          drawingArr.forEach((drawing) => {
            createMarker(drawing.pos, drawing.title).addListener('click', function () {
                drawing.infoWindow.open(map, newMarker)
                      //Each one of these infoWindows should have a click handler that
                      //uisrefs you over to the view page for that drawing
                  })
          })
      })($scope.allProjects)
  }

    geoLocationFactory.updateLocation
        .then(function (position) {
            return position.coords
        })
        .then( (coords) => {
            var lat = coords.latitude;
            var lng = coords.longitude;

           initMap(lat, lng)
        })
  // initMap()
});
