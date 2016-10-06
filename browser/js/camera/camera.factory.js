app.factory('CameraFactory', function ($log){

	function streamCamera(){

		var video = document.querySelector('#videoElement');

		navigator.getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia ||
			navigator.oGetUserMedia;

		if (navigator.getUserMedia) {
			navigator.getUserMedia({
				video: {
					frameRate: {
						ideal: 5,
						max: 10
					}
				}
			}, handleVideo, $log);
		}

		function handleVideo(stream) {
			video.src = window.URL.createObjectURL(stream);
		}
	}

	return {
		streamCamera: streamCamera,
	}

});
