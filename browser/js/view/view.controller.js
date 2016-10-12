app.controller('ViewCtrl', function($stateParams, CanvasFactory, DrawingFactory, TextFactory){

	$scope.orientationCorrect = false;

	CanvasFactory.initializeCanvas(window, document);
	
	console.log("project: ", $stateParams.project)

	//this draws the project on the paint canvas, with drawings, text, no images yet
	if ($stateParams.project.drawing){
		DrawingFactory.drawDrawingsOnCanvas([$stateParams.project.drawing])
	}
	if ( $stateParams.project.text ){
		TextFactory.drawTextsOnCanvas([$stateParams.project.text])
	}

	//this is the canvas that displays our tilt orientation guide
	let canvasTilt = document.getElementById('tiltCanvas');

	//context of that canvas
    let ctxTilt = canvasTilt.getContext('2d');

    //target til or tilt of project we're trying to render
    let projectTextX = $stateParams.project.angleX;
    let projectTextY = $stateParams.project.tiltY;

    console.log("tilt: x: ", projectTextX, "y: ", projectTextY);


    //set canvas width and height to width of div since it'll be less than height
    //css style width/height must equal canvas width and height or distortion happens
    let size = _.min([window.innerHeight, window.innerWidth]);
    canvasTilt.width  = size;
	canvasTilt.height = size; 
	canvasTilt.style.width  = size + 'px';
	canvasTilt.style.height = size + 'px';

    // console.log("ctx: ", ctxTilt)
    // console.log("screen: ", screen)
    // console.log("window: ", window)
    // console.log("canvas: ", canvasTilt)

    let center = size * 0.5

 	//outer target circle STAY STILL
 	ctxTilt.lineWidth=75;
    ctxTilt.beginPath();
	ctxTilt.arc(center, center,400,0,2*Math.PI);
	ctxTilt.stroke();

	//innner green circle 
	//move on device orientation
	//starts at center + the tilt of the picture
	function drawGreenCircle(x, y){
		ctxTilt.beginPath();
		ctxTilt.arc(x, y, 325, 0, 2*Math.PI);
		ctxTilt.fillStyle = 'green';
		ctxTilt.fill();
	}
	
	//this is the function that run on any tilt event
	//event is an object with properties on it which we'll use for x and y
	function deviceOrientationAction(event){
		//difference between image tilt and device tilt
		let x = event.gamma - projectTextX;
		let y = event.beta - projectTextY;

		//draw the green circle offset from the center the distance 
		//between image tfilt and device tilt
		drawGreenCircle(x,y);

		//see if green circle is pretty close to center
		//if it is, toggle orientationCorrect, this will hide the canvas 
		//with the circles and show the canvas with the project
		if(x < 10 && y < 10) {
			$scope.orientationCorrect = true;
		}
	}

	//this is the most important part, tells the program to listen for 
	//any changes in phone's orientation
	window.addEventListener("deviceorientation", deviceOrientationAction);
	//right now the ng-show for the drawing doesn't work
	//cuz the canvas for the drawings is on the canvas ctrl
	//but we can figure that out tomorrow

});
