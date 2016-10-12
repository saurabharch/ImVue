app.factory('signUpFactory', function($http, $log) { //is this factory used? I don't see it injected in the controller. If it is used somewhere else maybe it is better in that location -- KHGB
    var signUpFactory = {}

    signUpFactory.getUserEmail = function(email) {
        return $http.get('/api/users/email/' + email)
            .then(function(user) {
                console.log(user)
                if (user.data) {
                    return true;
                } else {
                    return false
                }
            })
    }

    signUpFactory.getUserName = function(name) {
        return $http.get('/api/users/username/' + name)
            .then(function(userName) {
                if (userName.data) {
                    return true;
                } else {
                    return false;
                }
            })
    }

    signUpFactory.postUser = function(user) {
        $http.post('/api/users/register', user)
            .then(function() {})
            .catch($log);
    }
    return signUpFactory
})
