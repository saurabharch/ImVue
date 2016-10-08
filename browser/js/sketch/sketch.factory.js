/* eslint-disable  id-length */
app.factory('SketchFactory', function($http, $log, geoLocationFactory, TextFactory){

    var db_Location = 'http://localhost:1337/api';

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

    function initialize(init_workspace, init_doc){
        workspace = init_workspace;
        doc = init_doc;

        initializeCanvas();
        initializeColorElements();

        TextFactory.initializeTextFactory(ctx);
    }

    function saveImg(){
        // Clearn the canvas to show the user a response
        // Could change this later to display a button that says saved \
        // and they can click it to acknowledge?
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var canvasPointsString = canvasPoints.join(',')

        navigator.geolocation.getCurrentPosition((position) => {
            $http.post( db_Location + '/drawings', {
                image: canvasPointsString,
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            })
            .catch($log)
        })

    } /* End of saveImg Function */

    function loadImg(id){

        $http.get( db_Location + '/drawings/' + id)
        .then(function(response){
            return response.data.image;
        })
        .then(function(canvasString){

            var canvasArray = canvasString.split(',')
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
        .catch($log)

    } /* End of load image function */

    function loadImage(id){
        $http.get( db_Location + '/images/' + id)
        .then(function(response){
            return response.data;
        })
        .then(function(img){
            let imgTag = new Image();
            imgTag.src = img.url;
            imgTag.onload = () => { canvas.drawImage(imgTag, img.x, img.y) }

        })
        .catch($log)

    }

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
            currentMousePosition.x = getCurrentX(event) - this.offsetLeft;
            currentMousePosition.y = getCurrentY(event) - this.offsetTop;

        }

    function mUp() {
        drawing = false;
    }

    function mMove(event) {
        event.preventDefault();

        if (!drawing) return;

        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;

        currentMousePosition.x = getCurrentX(event) - this.offsetLeft;
        currentMousePosition.y = getCurrentY(event) - this.offsetTop;

        // Push our points into an array
        canvasPoints.push(

            lastMousePosition.x + ',' + lastMousePosition.y + ',' +
            currentMousePosition.x + ',' + currentMousePosition.y + ',' +
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


    return {
        initialize: initialize,
        saveImg: saveImg,
        loadImg: loadImg,
        loadImage: loadImage
    }

})
