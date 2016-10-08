app.factory('ImageFactory', function(){

	let canvas;

	function initializeImageFactory(canvas2B){
		canvas = canvas2B;
	}

	function loadImagesToCanvas(images){

		images.forEach( image => {
			let img = new Image();
			img.src = image.src
			img.onload = () => {
				canvas.drawImage(img, image.x, image.y)
			}
		})
	}

	// Unsure how we're going to do this at the moment
	// function saveImages(){

	// }

	return {
		initializeImageFactory: initializeImageFactory,
		loadImagesToCanvas: loadImagesToCanvas,
	}
});
