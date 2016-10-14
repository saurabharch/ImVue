app.factory('ImageFactory', function(){

	let ctx;
	let imagesArr = [];

	function initializeImageFactory(canvasCtx){
		ctx = canvasCtx;
	}

	function drawImagesOnCanvas(images){
		images.map(loadImageOnCanvas);
	}

	function loadSelectedImageOnCanvas(imageStr){
		var image = fetchImages().filter( image => imageStr === image.name )[0]; // eslint-disable-line no-shadow
		loadImageOnCanvas(image)
		imagesArr.push(image);
	}

	function loadImageOnCanvas(image) {
		let img = new Image();
		img.src = image.source;
		console.log(img)
		img.onload = () => { ctx.drawImage(img, image.x, image.y) }
	}

	function fetchImages(){
		return [	/*eslint-disable id-length*/
			{ name: 'obama', 		source: 'img/obama.png', 		x: 0, y: 0},
			{ name: 'puppy', 		source: 'img/puppy.png', 		x: 0, y: 0},
			{ name: 'kitten', 		source: 'img/cat.png', 			x: 0, y: 0},
			{ name: 'waldo', 		source: 'img/waldo.png', 		x: 0, y: 0},
			{ name: 'warrior', 		source: 'img/warrior.png', 		x: 0, y: 0},
			{ name: 'little foot', 	source: 'img/LittleFoot.png', 	x: 0, y: 0}
		];			/*eslint-enable id-length*/
	}


	function saveImages() {
		return imagesArr;
	}

	return {
		initializeImageFactory: initializeImageFactory,
		drawImagesOnCanvas: drawImagesOnCanvas,
		loadSelectedImageOnCanvas: loadSelectedImageOnCanvas,
		loadImageOnCanvas: loadImageOnCanvas,
		saveImages: saveImages,
		fetchImages: fetchImages

	}
});
