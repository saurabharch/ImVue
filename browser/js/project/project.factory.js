app.factory('ProjectFactory', function(){
	var projects = [];

	function addProject(project){
		projects.push(project);
	}

	function getProjects(){
		return projects
	}

	return {
		addProject: addProject,
		getProjects: getProjects
	}
})
