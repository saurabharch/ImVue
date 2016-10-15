app.config(function($stateProvider) {
    $stateProvider.state('inbox', {
        url: '/inbox',
        templateUrl: 'js/inbox/inbox.template.html',
        controller: 'InboxCtrl',
    })
})
