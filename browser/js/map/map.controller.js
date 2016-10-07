app.controller('MapCtrl', function ($scope, geoLocationFactory, $http) {

  var map;
  var drawingArr = [];

  var styles = {
    default: null,
    hide: [{
      featureType: 'poi.business',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{
        visibility: 'off'
      }]
    }]
  };

  function createMarker(pos, title) {
    var newMarker = new google.maps.Marker({
      position: pos,
      map: map,
      title: title,
      mapTypeControl: false
    });
    return newMarker;
  }

  function initMap() {
    geoLocationFactory.updateLocation
      .then(function (position) {
        return position.coords
      })
      .then(function (coords) {
        var currentPos = {
          lat: coords.latitude,
          lng: coords.longitude
        }

        map = new google.maps.Map(document.getElementById('map'), {
          center: currentPos,
          zoom: 17,
          styles: styles['hide']
        })
        var currentPositionMarker = createMarker(currentPos, 'current Location');
        return $http.get(`/api/locations/ping/${coords.longitude}/${coords.latitude}`)
      })
      .then(function (drawings) {
        for (var i = 0; i < drawings.data.length; i++) {
          var pos = {
            lat: drawings.data[i].latitude,
            lng: drawings.data[i].longitude
          };
          var title = 'title: ' + drawings.data[i].id;
          var infowindow = new google.maps.InfoWindow({
            content: title
          });

          var marker = {
            pos: pos,
            title: title,
            infoWindow: infowindow
          }
          drawingArr.push(marker);
        }
        drawingArr.forEach(function (drawing) {
          var newMarker = createMarker(drawing.pos, drawing.title)
          newMarker.addListener('click', function () {
            drawing.infoWindow.open(map, newMarker)
              //Each one of these infoWindows should have a click handler that
              //uisrefs you over to the view page for that drawing
          })
        })
      })



  }

  initMap()



});