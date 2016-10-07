
'use strict'

app.config(function ($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'js/profile/profile.html',
        controller: 'profileCtrl',
        resolve: {
            profileInfo: function(profileFactory){
                return profileFactory.fetchProfileInfo();
            }
        }
    });
});
