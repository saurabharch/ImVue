app.controller('ViewCtrl', function ($scope, $stateParams, CanvasFactory, DrawingFactory, TextFactory) {

	var drawingPlace = document.getElementById('paint')
    var tiltPlace = document.getElementById('tiltCanvas')
    var videoPlace = document.getElementById('videoElement')

    var h = window.innerHeight
    var w = window.innerWidth

    drawingPlace.style.height = h + 'px'
    drawingPlace.style.width = w + 'px'
    drawingPlace.height = h
    drawingPlace.width = w

    if(tiltPlace){
        tiltPlace.style.height = h + 'px'
        tiltPlace.style.width = w + 'px'
        tiltPlace.height = h
        tiltPlace.width = w
    }

    videoPlace.style.height = h + 'px'
    videoPlace.style.width = w + 'px'
    videoPlace.height = h
    videoPlace.width = w


	$scope.orientationCorrect = false;

	CanvasFactory.initializeCanvas(window, document);

	//this draws the project on the paint canvas, with drawings, text, no images yet
	if ($stateParams.project.drawing) {
		DrawingFactory.drawDrawingsOnCanvas([$stateParams.project.drawing])
	}
	if ($stateParams.project.text) {
		TextFactory.drawTextsOnCanvas([$stateParams.project.text])
	}

	//this is the canvas that displays our tilt orientation guide
	let canvasTilt = document.getElementById('tiltCanvas');

	//context of that canvas
	let ctxTilt = canvasTilt.getContext('2d');

	//target til or tilt of project we're trying to render
	let projectTiltX = $stateParams.project.angleX;
	let projectTiltY = $stateParams.project.tiltY;

	//set canvas width and height to width of div since it'll be less than height
	//css style width/height must equal canvas width and height or distortion happens
	let size = _.min([window.innerHeight, window.innerWidth]);
	canvasTilt.width = size;
	canvasTilt.height = size;
	canvasTilt.style.width = size + 'px';
	canvasTilt.style.height = size + 'px';

	// console.log("ctx: ", ctxTilt)
	// console.log("screen: ", screen)
	// console.log("window: ", window)
	// console.log("canvas: ", canvasTilt)

	let center = size * 0.5

	//outer target circle STAY STILL
	function drawTargetCircle() {
		ctxTilt.lineWidth = 75;
		ctxTilt.beginPath();
		ctxTilt.arc(center, center, 400, 0, 2 * Math.PI);
		ctxTilt.stroke();
	}

	//innner green circle
	//move on device orientation
	//starts at center + the tilt of the picture
	function drawGreenCircle(x, y) { // eslint-disable-line id-length
		ctxTilt.beginPath();
		ctxTilt.arc(x, y, 325, 0, 2 * Math.PI);
		ctxTilt.fillStyle = 'green';
		ctxTilt.fill();
	}

	//this is the function that run on any tilt event
	//event is an object with properties on it which we'll use for x and y
	function deviceOrientationAction(event) {

		//see if green circle is pretty close to center
		//if it is, toggle orientationCorrect, this will hide the canvas
		//with the circles and show the canvas with the project
		if (Math.abs(event.beta - projectTiltY) < 25 && Math.abs(event.alpha - projectTiltX < 25)) {
			ctxTilt.clearRect(0, 0, canvasTilt.width, canvasTilt.height);
		} else {
			//difference between image tilt and device tilt
			let x = event.alpha - projectTiltX + center;	// eslint-disable-line id-length
			let y = event.beta - projectTiltY + center; // eslint-disable-line id-length

			ctxTilt.clearRect(0, 0, canvasTilt.width, canvasTilt.height);

			drawTargetCircle();
			//draw the green circle offset from the center the distance
			//between image tfilt and device tilt
			drawGreenCircle(center, y);
		}
	}

	//this is the most important part, tells the program to listen for
	//any changes in phone's orientation
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', deviceOrientationAction);
	} else {
		alert('your browser/device does not suppoort device orientation') // eslint-disable-line no-alert
	}
	//right now the ng-show for the drawing doesn't work
	//cuz the canvas for the drawings is on the canvas ctrl
	//but we can figure that out tomorrow

});