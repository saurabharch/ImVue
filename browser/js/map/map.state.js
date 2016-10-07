app.config(function($stateProvider) {
  $stateProvider.state('map', {
    url: '/map',
    templateUrl: 'js/map/map.template.html',
    controller: 'MapCtrl'
  })
});
