app.factory('SketchFactory', function($http, $log, geoLocationFactory ){

    var SketchFactory = {}

    var workspace;
    var doc;

    var canvas;
    var ctx;
    var color;
    var colorElements;
    var canvasPoints = [];

    var currentMousePosition = { x: 0, y: 0 };
    var lastMousePosition = { x: 0, y: 0 };

    var drawing = false;

    /* ---------------- SKETCH FACTORY ACCESSABLE FUNCTIONS ---------------- */

    SketchFactory.initialize = function(init_workspace, init_doc){
        workspace = init_workspace;
        doc = init_doc;

        initializeCanvas();
        initializeColorElements();
    }

    SketchFactory.saveImg = function(){
        // Clearn the canvas to show the user a response
        // Could change this later to display a button that says saved \
        // and they can click it to acknowledge?
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var canvasPointsString = canvasPoints.join(",")

        geoLocationFactory.updateLocation()
        .then( (position) => {
                $http.post('http://192.168.5.251:1337/api/drawings', {image: canvasPointsString, longitude: position.coords.longitude, latitude:position.coords.latitude})
            }
            )
        .then( (response) => {
            // Dont care about the response here
            // Our log below will let us know if something didn't go correctly 
            // Leaving this here for now in case we want to do something later
        })
        .catch($log)    

    } /* End of saveImg Function */

    SketchFactory.loadImg = function(){

        var drawing = doc.getElementById('paint')

        $http.get('http://192.168.5.251:1337/api/drawings/21')
        .then(function(response){
            return response.data.image;
        })
        .then(function(canvasString){
            
            var canvasArray = canvasString.split(",")
            for( var i = 0; i < canvasArray.length; i += 5 ){

                canvas.draw(  /* Start Point */
                             { x: canvasArray[i],
                               y: canvasArray[i+1] 
                             }, 
                             /* End Point */
                             {
                                x: canvasArray[i + 2],
                                y: canvasArray[i + 3]
                             },
                             /* Color */
                             canvasArray[i + 4]
                             );
            }
            
        })
        .catch($log)

    } /* End of load image function */

    /* ---------------- SKETCH FACTORY HELPER FUNCTIONS ---------------- */

    /* -------------------- CANVAS FUNCTIONS -------------------- */

    function initializeCanvas(){

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
        var w = canvas.clientWidth * pixelRatio,
            h = canvas.clientHeight * pixelRatio;
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
        
        ctx.lineWidth = 5
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';     
    }

    // Event functions for canvas

    function mDown(e) {
            e.preventDefault();

            drawing = true;
            currentMousePosition.x = e.changedTouches[0].pageX - this.offsetLeft;
            currentMousePosition.y = e.changedTouches[0].pageY - this.offsetTop;

        }

    function mUp() {
        drawing = false;
    }

    function mMove(e) {
        e.preventDefault();

        if (!drawing) return;

        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;

        currentMousePosition.x = e.changedTouches[0].pageX - this.offsetLeft;
        currentMousePosition.y = e.changedTouches[0].pageY - this.offsetTop;

        // Push our points into an array
        canvasPoints.push(
            lastMousePosition.x + "," + 
            lastMousePosition.y + "," + 
            currentMousePosition.x + "," +
            currentMousePosition.y + "," + 
            color
        )

        canvas.draw(lastMousePosition, currentMousePosition, color);
    }

    /* -------------------- COLOR ELEMENT FUNCTIONS -------------------- */

    function initializeColorElements(){

        colorElements = [].slice.call(doc.querySelectorAll('.marker'));

        colorElements.forEach(function (el) {

            // Set the background color of this element
            // to its id (purple, red, blue, etc).
            el.style.backgroundColor = el.id;

            // Attach a click handler that will set our color variable to
            // the elements id, remove the selected class from all colors,
            // and then add the selected class to the clicked color.
            function pickColor() {
                color = this.id;
                doc.querySelector('.selected').classList.remove('selected');
                this.classList.add('selected');
            }

            el.addEventListener('click', pickColor);
            el.addEventListener('tap', pickColor);

        });
    }

    return SketchFactory

})