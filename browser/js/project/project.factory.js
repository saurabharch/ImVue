app.factory('ProjectFactory', function(geoLocationFactory, $http, $log) {
    var projects = [];

    function addProject(project) {
        projects.push(project);
    }

    function getProjects() {
        return projects;
    }

    function updateProjects(position) {
        $http.get('/api/projects/' + position.coords.latitude + '/' + position.coords.longitude)
            .then(foundProjects => {
                if (foundProjects.data.length) {
                    projects = foundProjects.data;
                } else {
                    projects = [];
                }
            })
            .catch($log)
    }

    return {
        addProject: addProject,
        getProjects: getProjects,
        updateProjects: updateProjects
    }
})
