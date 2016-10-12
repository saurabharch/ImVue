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
	}

	function loadImageOnCanvas(image) {
		var stickers = fetchStickers();

		var sticker = stickers.filter(stick => stick.name === image)[0];

		canvas = document.getElementById('paint');
		ctx = canvas.getContext('2d');

		let img = new Image();
		img.src = sticker.url;
		img.onload = () => { ctx.drawImage(img, 0, 0) }

		stickerArr.push(sticker.url);
	}

	function fetchStickers(){
		return [
			{name: 'obama', url: 'img/obama.png'},
			{name: 'puppy', url: 'img/puppy.png'},
			{name: 'kitten', url: 'img/cat.png'},
			{name: 'waldo', url: 'img/waldo.png'},
			{name: 'warrior', url: 'img/warrior.png'},
			{name: 'little foot', url: 'img/LittleFoot.png'}
		];
	}

	// function fetchStickers() {
	// 	return stickerArr;
	// }

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
