app.factory('mapFactory', (geoLocationFactory, $http, $log) => {

    var map;
    var projectMarkers = [];
    var currentLocation;

    function fetchMapProjects() {
        return geoLocationFactory.updateLocation()
            .then(position => {
                currentLocation = position;
                return $http.get('/api/projects/map/' + position.coords.latitude + '/' + position.coords.longitude)
            })
            .then(projects => {
                return projects.data;
            })
            .catch($log)
    }

    function createMarker(pos, title) {
        return new google.maps.Marker({ // eslint-disable-line no-undef
            position: pos,
            map: map,
            title: title,
            mapTypeControl: false
        });
    }

    function initMap(mapProjects) {

        map = new google.maps.Map(document.getElementById('map'), { // eslint-disable-line no-undef
            center: { lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude },
            zoom: 18
        });

        (function(mapProjects) { // eslint-disable-line no-shadow
            var pos;
            var title;
            var infowindow;
            var marker;

            mapProjects.forEach(project => {
                pos = { lat: project.latitude, lng: project.longitude };
                title = 'title: ' + project.id;
                infowindow = new google.maps.InfoWindow({ content: title }); // eslint-disable-line no-undef

                marker = {
                    pos: pos,
                    title: title,
                    infowindow: infowindow
                }

                projectMarkers.push(marker);
            })

            projectMarkers.forEach(projectMarker => {
                createMarker(projectMarker.pos, projectMarker.title).addListener('click', function() {
                    projectMarker.infoWindow.open(map, projectMarker)
                        //Each one of these infoWindows should have a click handler that
                        //uisrefs you over to the view page for that projectMarker
                })
            })

        })(mapProjects);
    }

    return {
        fetchMapProjects: fetchMapProjects,
        initMap: initMap
    };
})
