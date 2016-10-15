app.controller('ColorCtrl', function($scope, ColorFactory) {

    $scope.toggleColorPalette = ColorFactory.toggleColorPalette;
    $scope.showColorPalette = ColorFactory.showColorPalette;

});
