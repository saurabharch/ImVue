
'use strict'

app.config(function ($stateProvider) {
    $stateProvider.state('profile', {

        url: '/profile/:userId',
        templateUrl: 'js/profile/profile.template.html',
        controller: 'profileCtrl',

        resolve:{
            loginInUserDrawings: function(profileFactory,$stateParams){

                // return profileFactory.fetchAllUserDrawings($stateParams.userId)
                    return profileFactory.fetchAllUserDrawings(1);

            }
        }
    });
});

