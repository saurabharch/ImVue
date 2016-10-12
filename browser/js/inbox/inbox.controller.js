app.controller('InboxCtrl', function ($scope, geoLocationFactory, $http) {


  var fake = []
  for (var i = 0; i < 21; i++){
    var drawnt = { id: i, name: _.sample(['Han', 'Jose', 'Joe', 'Danny', 'Steve Irwin', 'Sammy Davis Jr.']), address: '5 Hanover Square New York, NY 10004', date: '10/9/2016', distance: _.random(2, 25)}

    if (i % 3 === 0) {
      drawnt.viewed = true
    } else {
      drawnt.viewed = false
    }
    fake.push(drawnt)
  }

    function coordsToAddress(geocoder, lat, lng) {
      var latlng = { lat: lat, lng: lng}
      geocoder.geocode({ location: latlng}, function(results, status) {
        if (status === 'OK') {
          console.log(results)
        } else {
          alert('Geocode was not successful for the following reason: ' + status); // eslint-disable-line no-alert
        }
      });
    }

  function populateList(){
    var geocoder = new google.maps.Geocoder();  // eslint-disable-line no-undef
    geoLocationFactory.updateLocation //does this need to be invoked?? -- KHGB
      .then(function (position) {
        console.log(position.coords)
        var lat = position.coords.latitude
        var lng = position.coords.longitude
        coordsToAddress(geocoder, lat, lng)
        $http.get(`/api/locations/${lng}/${lat}`) //NO http in the controller
        .then(function(allInfo){
          //allInfo contains drawings, texts, and images
          //TODO: CHECKOUT THE FORMAT OF ALLINFO
          console.log(allInfo.data);
          $scope.drawings = allInfo.drawings;

        })
      })
  }

  populateList()

});
