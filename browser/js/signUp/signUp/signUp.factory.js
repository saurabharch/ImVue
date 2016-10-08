app.factory('signUpFactory', function($http, $q) {
    var signUpFactory = {}

    signUpFactory.getUserEmail = function(email) {
        console.log(email)


        return $http.get('/api/user/email/' + email)
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


        return $http.get('/api/user/username/' + name)
            .then(function(userName) {
                if (userName.data) {
                    return true;
                } else {
                    return false;
                }
            })
    }

    signUpFactory.postUser = function(user) {

        $http.post('/api/user/register', user)
            .then(function(user) {}).catch(function(error) {
                return error
            });
    }
    return signUpFactory
})
