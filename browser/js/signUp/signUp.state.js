'use strict'

app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: '/js/signUp/signUp.html',
        controller: 'SignUpCtrl'
    });
});
