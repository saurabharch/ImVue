app.controller('SignupCtrl', function($scope, AuthService, $state, signUpFactory) {

    $scope.sendSignUp = function(signUpUser) {
        console.log('~~~~~~~~~~im in controller', signUpUser)
        AuthService.signUp(signUpUser.userName, signUpUser.email, signUpUser.password)
    };
});
