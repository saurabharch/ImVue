app.config(function($stateProvider) {
    $stateProvider.state('view', {
        url: '/view',
        templateUrl: 'js/view/view.html',
        controller: 'ViewCtrl',
        params: { project: null }
    });
});
