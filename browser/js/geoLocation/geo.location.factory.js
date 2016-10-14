app.factory('geoLocationFactory', function () {

	var previousPosition = false;
	var currentPosition = false;
	var range = 0.00025;	// 0.00025 ~46 meters this is half our get location range http://www.csgnetwork.com/gpsdistcalc.html

	function updateLocation(){
		// the reject will be taken care of by a .catch when used
		return new Promise( (resolve, reject) => { navigator.geolocation.getCurrentPosition(resolve) }) // eslint-disable-line no-unused-vars
    }

	function updateChangedLocation(){
		return updateLocation().then( newPosition => {
			if ( !previousPosition && !currentPosition ){
				previousPosition = newPosition;
				currentPosition = newPosition;
				return currentPosition;
			}
			else if ( locationValidation() ){
				previousPosition = currentPosition;
				currentPosition = newPosition;
				return currentPosition;
			}
			else {
				return false;
			}
		})
    }

    // Factory helper functions below

	function getPosLong(position){
		return position.coords.longitude;
	}

	function getPosLat(position){
		return position.coords.latitude;
	}

	function locationValidation(){
		if ( Math.abs( getPosLong(previousPosition) - getPosLong(currentPosition)) > range ) return true;
		else if ( Math.abs( getPosLat(previousPosition) - getPosLat(currentPosition)) > range ) return true;
		else return false;
	}

	return {
		updateLocation: updateLocation,
		updateChangedLocation: updateChangedLocation
	}

});
