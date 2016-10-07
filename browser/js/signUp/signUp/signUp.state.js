app.config(function($stateProvider) {

    $stateProvider.state('signUp', {
        url: '/members/register',
        templateUrl: 'js/signUp/signUp.html',
        controller: 'SignupCtrl'
    });

});
