app.config(function($stateProvider) {
    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.template.html',
        controller: 'MapCtrl',
        resolve: {
            mapProjects: (mapFactory) => {
                return mapFactory.fetchMapProjects()
            }
        }
    })
});


// resolve: {
//     thePlaylist: function (PlaylistFactory, $stateParams) {
//         return PlaylistFactory.fetchById($stateParams.playlistId);
//     }
// }
