app.factory('ProfileFactory', function($http) {
    let profileFactory = {};


    profileFactory.fetchAllUserProjects = (userId) => {
        var path = '/api/projects/' + userId;
        return $http.get(path).then((userProjects) => {
            return userProjects.data
        })

    };

    return profileFactory;

})
