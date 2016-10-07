/* global app */
'use strict'

app.controller('profileCtrl', function($scope, $state, memberFactory, member) {

    $scope.currentUser = member;

})
