app.controller('SignUpCtrl', function($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendSignUp = function(signUpUser) {
        $scope.error = null;
        AuthService.signUp(signUpUser.userName, signUpUser.email, signUpUser.password)
            .then(() => {
                $state.go('home');
            }).catch(() => {
                $scope.error = 'Invalid username/email combination'
            });
    };
});
