app.factory('ImageFactory', function(){

	let canvas;
	let ctx;
	let stickerArr = [];


	function initializeImageFactory(canvas2B){
		canvas = canvas2B;
	}

	function drawImagesOnCanvas(images){
		canvas = document.getElementById('paint');
    ctx = canvas.getContext('2d');

		images.map(loadImageOnCanvas);

		// images.forEach( image => {
		// 	let img = new Image();
		// 	img.src = image.source;
		// 	img.onload = () => {
		// 		ctx.drawImage(img, image.x, image.y)
		// 	}
		// })
	}


	function loadImageOnCanvas(image) {
		var stickers = [
			{name: 'obama', url: 'img/obama.png'},
			{name: 'puppy', url: 'img/puppy.png'},
			{name: 'kitten', url: 'img/cat.png'},
			{name: 'waldo', url: 'img/waldo.png'},
			{name: 'warrior', url: 'img/warrior.png'}
		];

		var sticker = stickers.filter(s => s.name === image)[0];


    canvas = document.getElementById('paint');
    ctx = canvas.getContext('2d');

		let img = new Image();
		img.src = sticker.url;
		img.onload = () => {
			ctx.drawImage(img, 0, 0);
		}

		stickerArr.push(sticker.url);

	}

	function fetchStickers() {
		return stickerArr;
	}

	// Unsure how we're going to do this at the moment
	// function saveImages(){

	// }

	return {
		initializeImageFactory: initializeImageFactory,
		drawImagesOnCanvas: drawImagesOnCanvas,
		loadImageOnCanvas: loadImageOnCanvas,
		fetchStickers: fetchStickers
	}
});
