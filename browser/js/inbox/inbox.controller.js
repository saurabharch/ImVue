app.controller('InboxCtrl', function ($scope, geoLocationFactory, $http, CanvasFactory) {

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
