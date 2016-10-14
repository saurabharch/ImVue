/* global app */
'use strict'
// app.controller('profileCtrl', function($scope, $state, memberFactory, member) {
app.controller('ProfileCtrl', function($scope) {

    console.log('Trying to get Drawings')
    //$scope.currentUserDrawings = loginInUserDrawings()

    console.log('Successfuly loaded profile Ctrl');

    var fake = []
    for(var i=0;i<20;i++){
    	fake.push({date:i + '/15/2004', location: '5 Hanover Square NY, NY'})
    }

    console.log(fake)

    $scope.projects = fake

})
