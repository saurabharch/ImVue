/* global app */
'use strict'
console.log('Loading this factory')
// app.controller('profileCtrl', function($scope, $state, memberFactory, member) {
app.controller('profileCtrl', function($scope, $state, profileFactory) {

    console.log('Trying to get Drawings')
    $scope.currentUserDrawings = loginInUserDrawings()

    console.log('Successfuly loaded profile Ctrl');

})
