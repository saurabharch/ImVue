app.factory('profileFactory', function($http, $q, $rootScope, AuthService) {
    let profileFactory = {};

    profileFactory.fetchProfileInfo = () => {
        return "Got Profile Factory Data"
    };

    return profileFactory;

})
