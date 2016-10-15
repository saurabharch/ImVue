app.controller('TextCtrl', function($scope, TextFactory) {

    $scope.getTextSizes = () => TextFactory.getTextSizes;

    $scope.getFontFamilies = () => TextFactory.getFontFamilies;

    $scope.getTextLocations = () => TextFactory.getTextLocations;

    $scope.showInput = function() {
        return true;
    }
    $scope.addText = function() {
        var fontLocation = JSON.parse($scope.fontLocation)
        TextFactory.drawText($scope.fontSize, $scope.fontFamily, 'red', fontLocation.x, fontLocation.y, $scope.textInput)
    }
    $scope.toggleTextSelect = TextFactory.toggleTextSelect
    $scope.showTextSelect = TextFactory.showTextSelect
});
