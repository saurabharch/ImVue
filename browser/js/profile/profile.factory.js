app.factory('profileFactory', function() {
    let profileFactory = {};

    profileFactory.fetchProfileInfo = () => {
        return 'Got Profile Factory Data';
    };

    return profileFactory;

})
