app.controller('ViewCtrl', function($scope, $stateParams, CanvasFactory, DrawingFactory, TextFactory, ImageFactory) { // eslint-disable-line max-statements

    var drawingPlace = document.getElementById('paint')
    var tiltPlace = document.getElementById('tiltCanvas')
    var videoPlace = document.getElementById('videoElement')

    var height = window.innerHeight
    var width = window.innerWidth

    drawingPlace.style.height = height + 'px'
    drawingPlace.style.width = width + 'px'
    drawingPlace.height = height
    drawingPlace.width = width

    if (tiltPlace) {
        tiltPlace.style.height = height + 'px'
        tiltPlace.style.width = width + 'px'
        tiltPlace.height = height
        tiltPlace.width = width
    }

    videoPlace.style.height = height + 'px'
    videoPlace.style.width = width + 'px'
    videoPlace.height = height
    videoPlace.width = width


    $scope.orientationCorrect = false;

    CanvasFactory.initializeCanvas(window, document);

    //this is the canvas that displays our tilt orientation guide
    let canvasTilt = document.getElementById('tiltCanvas');

    //context of that canvas
    let ctxTilt = canvasTilt.getContext('2d');

    //target til or tilt of project we're trying to render
    let projectTiltX = $stateParams.project.angle; // eslint-disable-line no-unused-vars
    let projectTiltY = $stateParams.project.tilt;

    //set canvas width and height to width of div since it'll be less than height
    //css style width/height must equal canvas width and height or distortion happens
    let size = _.min([window.innerHeight, window.innerWidth]);
    canvasTilt.width = size;
    canvasTilt.height = size;
    canvasTilt.style.width = size + 'px';
    canvasTilt.style.height = size + 'px';

    let center = size * 0.5

    let projectImagesDrawn = false;

    //outer target circle STAY STILL
    function drawTargetCircles() {
        CanvasFactory.clearCanvas();
        projectImagesDrawn = false;

        ctxTilt.lineWidth = 30;
        ctxTilt.strokeStyle = 'red';
        ctxTilt.beginPath();
        ctxTilt.arc( center, center, 300, 0, 2 * Math.PI);
        ctxTilt.stroke();

        ctxTilt.lineWidth = 30;
        ctxTilt.strokeStyle = 'red';
        ctxTilt.beginPath();
        ctxTilt.arc( center, center, 200, 0, 2 * Math.PI);
        ctxTilt.stroke();

        ctxTilt.beginPath();
        ctxTilt.arc( center, center, 100, 0, 2 * Math.PI);
        ctxTilt.fillStyle = 'red';
        ctxTilt.fill();
    }

    //innner green circle
    //move on device orientation
    //starts at center + the tilt of the picture
    function drawGreenCircle( x, y) { // eslint-disable-line id-length
        ctxTilt.beginPath();
        ctxTilt.arc( x, y, 100, 0, 2 * Math.PI);
        ctxTilt.fillStyle = 'green';
        ctxTilt.fill();
    }

    //this is the function that run on any tilt event
    //event is an object with properties on it which we'll use for x and y
    function deviceOrientationAction(event) {

        //see if green circle is pretty close to center
        //if it is, toggle orientationCorrect, this will hide the canvas
        //with the circles and show the canvas with the project
        // if (Math.abs(event.beta - projectTiltY) < 25 && Math.abs(event.alpha - projectTiltX < 25)) {
        if ( Math.abs(event.beta - projectTiltY) < 15 ){

            ctxTilt.clearRect(0, 0, canvasTilt.width, canvasTilt.height);
            if (!projectImagesDrawn){
                if ($stateParams.project.drawing) {
                    DrawingFactory.drawDrawingsOnCanvas([$stateParams.project.drawing])
                }
                if ($stateParams.project.texts.length) {
                    TextFactory.drawTextsOnCanvas($stateParams.project.texts)
                }
                if ($stateParams.project.images.length) {
                    ImageFactory.drawImagesOnCanvas($stateParams.project.images)
                }
                projectImagesDrawn = true;
            }
        } else {
            let y = ( (( event.beta - projectTiltY ) * 5) + center )  // eslint-disable-line id-length
            let x = center;                                     // eslint-disable-line id-length

            ctxTilt.clearRect(0, 0, canvasTilt.width, canvasTilt.height);

            drawTargetCircles();
            drawGreenCircle( x, y);
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
