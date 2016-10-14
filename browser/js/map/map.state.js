app.config(function($stateProvider) {
  $stateProvider.state('map', {
    url: '/map',
    templateUrl: 'js/map/map.template.html',
    controller: 'MapCtrl',
      resolve: {
        localProjects:  (mapFactory) => {
            return mapFactory.fetchAllLocalProjects()
        }
      }
  })
});


// resolve: {
//     thePlaylist: function (PlaylistFactory, $stateParams) {
//         return PlaylistFactory.fetchById($stateParams.playlistId);
//     }
// }
