app.factory('mapFactory', (geoLocationFactory,$http)=> {

    let mapFactory = {}

    mapFactory.fetchAllLocalProjects = () => {
        console.log("Getting all Projects")
        return geoLocationFactory.updateLocation
            .then(function (position) {
                return position.coords
            })
            .then( (coords) =>{
                 var lat = coords.latitude;
                 var lng = coords.longitude;
                //
                // console.log('Latitude',lat);
                // console.log('Longitude', lng)
                return $http.get('/api/locations/'+lat+'/'+lng).then((projects) => {
                    // console.log(projects)
                    return projects;
                }).catch()
            })
    }

    return mapFactory;

})
