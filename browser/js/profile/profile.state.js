'use strict'

app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile/:userId',
        templateUrl: 'js/profile/profile.template.html',
        controller: 'ProfileCtrl'
    });
});
