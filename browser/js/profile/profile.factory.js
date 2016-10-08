app.factory('profileFactory', function($http) {
    let profileFactory = {};


    profileFactory.fetchAllUserDrawings = (userId) => {
        var path = '/api/user/'+userId+'/drawings'
        return $http.get(path).then((userDrawings) => {
            return userDrawings;
        })

    };

    return profileFactory;

})
