app.factory('CameraFactory', function () {

	var cameraOptions = false;

	var streamCamera = () => {

		var videoSelect = document.querySelector('select#videoSource');
		var videoElement = document.querySelector('#videoElement');

		function gotCameras(devInfos) {
			for (var i = devInfos.length; i > -1; i--) {
				var devInfo = devInfos[i];
				var option = document.createElement('option');
				option.value = devInfo.deviceId;

				if (devInfo.kind === 'videoinput') {
					option.text = devInfo.label || 'camera ' + (videoSelect.length + 1);
					videoSelect.appendChild(option);
				} else {
					//console.log('Some other kind of source/device: ', devInfo);
				}
			}
		}

		navigator.mediaDevices.enumerateDevices().then(gotCameras).catch(handleError);


		function gotStream(stream) {
			window.stream = stream;
			videoElement.srcObject = stream;
			return navigator.mediaDevices.enumerateDevices();
		}


		function start() {
			if (window.stream) {
				window.stream.getTracks().forEach(function (track) {
					track.stop();
				});
			}

			var videoSource = videoSelect.value;
			var constraints = {
				video: {
					deviceId: videoSource ? {
						exact: videoSource
					} : undefined
				}
			};

			navigator.mediaDevices.getUserMedia(constraints)
				.then(gotStream)
				// .then(gotCameras)
				.catch(handleError)
		}

		videoSelect.onchange = start;
		start();

		function handleError(error) {
			console.log('navigator.getUserMedia error: ', error);
		}

	}

	function toggleCameraOptions() {
		cameraOptions = !cameraOptions;
	}


    function showCameraOptions(){
        return cameraOptions;
    }

	return {
		streamCamera: streamCamera,
		toggleCameraOptions: toggleCameraOptions,
		showCameraOptions: showCameraOptions
	}
});
