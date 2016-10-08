app.factory('DrawingFactory', function($http, $log){

	let drawingPoints = [];
	let canvas;

	function initializeDrawingFactory(canvas2B){
		canvas = canvas2B;
	}

	function addDrawingPoint( lastPos, currentPos, color ){
		drawingPoints.push(
            lastPos.x + ',' + lastPos.y + ',' +			// eslint-disable-line id-length
            currentPos.x + ',' + currentPos.y + ',' +	// eslint-disable-line id-length
            color
        )
	}

	function saveDrawing(){

        var drawingPointsString = drawingPoints.join(',')

        navigator.geolocation.getCurrentPosition((position) => {
            $http.post('http://localhost:1337/api/drawings', {
                image: drawingPointsString,
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            })
            .catch($log)
        })

    } /* End of saveImg Function */

    function loadDrawingsOnCanvas(drawings){

		drawings.forEach( drawingString => {

			var canvasArray = drawingString.split(',')
			for (var i = 0; i < canvasArray.length; i += 5 ){

				canvas.draw(
					/* Start Point */
					{ x: canvasArray[i], y: canvasArray[i + 1] },          // eslint-disable-line id-length
					/* End Point */
					{ x: canvasArray[i + 2], y: canvasArray[i + 3] },      // eslint-disable-line id-length
					/* Color */
					canvasArray[i + 4]
				);
			}
		})


    } /* End of load image function */

	return {
		initializeDrawingFactory: initializeDrawingFactory,
		addDrawingPoint: addDrawingPoint,
		saveDrawing: saveDrawing,
		loadDrawingsOnCanvas: loadDrawingsOnCanvas
	}

});
