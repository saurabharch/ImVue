app.controller('MapCtrl', function($scope, mapFactory, mapProjects) {
    $scope.allProjects = mapProjects;
    mapFactory.initMap(mapProjects);
});
