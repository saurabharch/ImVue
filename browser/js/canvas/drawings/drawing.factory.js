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

			$http.post('/api/drawings', {location: position, image:  drawingPointsString})
            .catch($log)
        })

    } /* End of saveImg Function */

    function drawDrawingsOnCanvas(drawings){

		drawings.forEach( drawing => {
			let canvasArray = drawing.image.split(',')
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
		drawDrawingsOnCanvas: drawDrawingsOnCanvas
	}

});
