app.factory('CanvasFactory', function($http, $log, geoLocationFactory, ColorFactory, TextFactory, DrawingFactory, ImageFactory){ // eslint-disable-line max-params

	var workspace;
    var doc;

	var canvas;
    var ctx;

    var currentMousePosition = { x: 0, y: 0 };  // eslint-disable-line id-length
    var lastMousePosition = { x: 0, y: 0 };     // eslint-disable-line id-length

    var drawing = false;

    let currentLocationResponse;
    let currentLocDrawings;
    let currentLocTexts;
    let currentLocImages;

    /* ---------------- ACCESSABLE FUNCTIONS ---------------- */

    function initializeCanvas(init_workspace, init_doc){
        workspace = init_workspace;
        doc = init_doc;

        loadCanvas();
        ColorFactory.initializeColorElements(doc);
        DrawingFactory.initializeDrawingFactory(canvas);
        ImageFactory.initializeImageFactory(canvas);
        TextFactory.initializeTextFactory(ctx);
    }

    function saveCanvasContent(){
        let drawingToSave = DrawingFactory.saveDrawing();
        let texts = []; //TextFactory.saveTexts();
        let images = {source: 'waldo.png', x: 100, y: 200}; // eslint-disable-line id-length

        //let images = ImageFactory.saveImages();

        navigator.geolocation.getCurrentPosition((position) => {

            $http.post('https://localhost:1337/api/locations/' + position.coords.latitude + '/' + position.coords.longitude, {drawing: {image: drawingToSave}, texts: texts, images: images} )
            .then( () => {
                alert('Drawing Saved Successfully') // eslint-disable-line no-alert
            })
            .catch($log)

        })
    }

    function loadCanvasContent(){

        navigator.geolocation.getCurrentPosition((position) => {
            $http.get('https://localhost:1337/api/locations/' + position.coords.latitude + '/' + position.coords.longitude )
            .then( response => {

                currentLocationResponse = [];
                currentLocDrawings = [];
                currentLocTexts = [];
                currentLocImages = [];

                response.data.forEach(function(location){
                    currentLocationResponse.push(location)
                    // Turnary array pushes
                    if ( location.drawings.length )  { currentLocDrawings = currentLocDrawings.concat(location.drawings) }
                    if ( location.texts.length )     { currentLocTexts = currentLocTexts.concat(location.texts) }
                    if ( location.images.length )    { currentLocImages = currentLocImages.concat(location.images)  }
                })
                //drawCurrentContentOnCanvas();

            })
            .catch($log)


        })
    }

    function drawCurrentContentOnCanvas(){
        DrawingFactory.drawDrawingsOnCanvas(currentLocDrawings);
        TextFactory.drawTextsOnCanvas(currentLocTexts);
        //ImageFactory.drawImagesOnCanvas(currentLocImages);
    }

    function clearCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        DrawingFactory.clearDrawingPoints();
    }

    function undoLast(){
        console.log(DrawingFactory.drawingPoints())
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        var currentDrawing = DrawingFactory.drawingPoints()
        currentDrawing.pop()
        currentDrawing.pop()
        currentDrawing.pop()
        currentDrawing.forEach(function(point){
            point = point.split(',')
            var start = {x: point[0], y: point[1]}  // eslint-disable-line id-length
            var end = {x: point[2], y: point[3]}    // eslint-disable-line id-length
            var color = point[4]
            console.log(point)
            canvas.draw(start, end, color)
        })

    }

    /* ---------------- HELPER FUNCTIONS ---------------- */

    function loadCanvas(){

        canvas = doc.getElementById('paint');
        ctx = canvas.getContext('2d');

        resizeCanvas()
        workspace.addEventListener('resize', resizeCanvas)

        // Touch screen event handlers
        canvas.addEventListener('touchstart', mDown);
        canvas.addEventListener('touchend', mUp);
        canvas.addEventListener('touchmove', mMove);

        // Keyboard event handlers
        //canvas.addEventListener('mousedown', mDown);
        //canvas.addEventListener('mouseup', mUp);
        //canvas.addEventListener('mousemove', mMove);

        canvas.draw = function (start, end, strokeColor) {
            ctx.beginPath();
            ctx.strokeStyle = strokeColor || 'black';
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.closePath();
        };
    }

    function resizeCanvas() {
        // Unscale the canvas (if it was previously scaled)
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // The device pixel ratio is the multiplier between CSS pixels
        // and device pixels
        var pixelRatio = workspace.devicePixelRatio || 1;

        // Allocate backing store large enough to give us a 1:1 device pixel
        // to canvas pixel ratio.
        var w = canvas.clientWidth * pixelRatio,    // eslint-disable-line id-length
            h = canvas.clientHeight * pixelRatio;   // eslint-disable-line id-length
        if (w !== canvas.width || h !== canvas.height) {
            // Resizing the canvas destroys the current content.
            // So, save it...
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            canvas.width = w; canvas.height = h;

            // ...then restore it.
            ctx.putImageData(imgData, 0, 0)
        }

        // Scale the canvas' internal coordinate system by the device pixel
        // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
        // backing store is larger.
        ctx.scale(pixelRatio, pixelRatio);

        ctx.lineWidth = 5;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    // Event functions for canvas

    function getCurrentX(event){
        return Math.floor(event.changedTouches[0].pageX)
    }

    function getCurrentY(event){
        return Math.floor(event.changedTouches[0].pageY)
    }

    function mDown(event) {
            event.preventDefault();

            drawing = true;
            currentMousePosition.x = getCurrentX(event) - this.offsetLeft;  // eslint-disable-line id-length
            currentMousePosition.y = getCurrentY(event) - this.offsetTop;   // eslint-disable-line id-length

        }

    function mUp() {
        drawing = false;
    }

    function mMove(event) {
        event.preventDefault();

        if (!drawing) return;

        lastMousePosition.x = currentMousePosition.x;   // eslint-disable-line id-length
        lastMousePosition.y = currentMousePosition.y;   // eslint-disable-line id-length

        currentMousePosition.x = getCurrentX(event) - this.offsetLeft;  // eslint-disable-line id-length
        currentMousePosition.y = getCurrentY(event) - this.offsetTop;   // eslint-disable-line id-length

        // Save points for each drawing
        DrawingFactory.addDrawingPoint(lastMousePosition, currentMousePosition, ColorFactory.getCurrentColor())


        canvas.draw(lastMousePosition, currentMousePosition, ColorFactory.getCurrentColor());

    }

    function getCurrentLocationResponse(){
        return currentLocationResponse;
    }

    return {
        initializeCanvas: initializeCanvas,
        saveCanvasContent: saveCanvasContent,
        loadCanvasContent: loadCanvasContent,
        clearCanvas: clearCanvas,
        undoLast: undoLast,
        getCurrentLocationResponse: getCurrentLocationResponse,
        getCurrentDrawings: currentLocDrawings,
        getCurrentImages: currentLocImages,
        getCurrentTexts: currentLocTexts
    }

});
