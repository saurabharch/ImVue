app.controller('InboxCtrl', function ($scope, geoLocationFactory, $http, CanvasFactory) {


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

  let projects = [];

  CanvasFactory.getCurrentLocationResponse().forEach(function(response){

    var currentLocation = {}

    response.drawings.forEach( drawing => {
      if ( !currentLocation[drawing.userId] ){
        currentLocation[drawing.userId] = {};
      }

      currentLocation[drawing.userId].drawing = drawing;
    })

    response.images.forEach( image => {
      if ( !currentLocation[image.userId] ){
        currentLocation[image.userId] = {};
      }

      currentLocation[image.userId].image = image;
    })

    response.texts.forEach( text => {
      if ( !currentLocation[text.userId] ){
        currentLocation[text.userId] = {};
      }

      currentLocation[text.userId].text = text;
    })

    _.keys(currentLocation).forEach(function(userId){

      // console.log(currentLocation[userId])

      if (currentLocation[userId].drawing) {
        currentLocation[userId].name = currentLocation[userId].drawing.user.userName
        currentLocation[userId].date = currentLocation[userId].drawing.createdAt
      } else if (currentLocation[userId].text) {
        currentLocation[userId].date = currentLocation[userId].text.createdAt
        currentLocation[userId].name = currentLocation[userId].text.user.userName
      } else if (currentLocation[userId].image) {
        currentLocation[userId].date = currentLocation[userId].image.createdAt
        currentLocation[userId].name = currentLocation[userId].image.user.userName
      }
      
      projects.push(currentLocation[userId])
    })


  })

  $scope.projects = projects

  // populateList()

});
