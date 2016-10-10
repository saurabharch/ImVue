app.factory('profileFactory', function($http) {
    let profileFactory = {};


    profileFactory.fetchAllUserDrawings = (userId) => {
        // WE HAVEN'T SETUP THE ASSOCIATION BETWEEN USER AND DRAWINGS
        // THIS ROUTE IS CURRENTLY NOT WORKING
        // ref => user/index.js
        var path = '/api/user/' + userId + '/drawings';
        return $http.get(path).then((userDrawings) => {
            return userDrawings;
        })

    };

    return profileFactory;

})
