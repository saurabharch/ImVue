app.controller('InboxCtrl', function($scope, ProjectFactory) {
    $scope.projects = ProjectFactory.getProjects();
});
