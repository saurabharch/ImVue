var chai = require('chai')
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

var projectRanges = require('../../../server/app/routes/projects/projects.ranges.js');

describe('Project Route', () => {

	var app, Project, Drawing, Text, Image, User;

	var location = {
		lat: 	40.7058661,
		long: 	-74.0091257,
	}

	var ProjectInfo = {
		id: 		1, 
		latitude: 	location.lat,
		longitude: 	location.long,
		angle: 		45,
		tilt: 		1
	};

	var DrawingInfo = {
		id: 		1, 
		image: 		'300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue', 
	};

	var TextInfo = {
		id: 		1, 
		font: 		'serif', 
		size: 		32, 
		color: 		'black', 
		x: 			843, 
		y: 			357, 
		content: 	'Hello World',
	};

	var ImageInfo = {
		id: 		1,
		source: 	'img/cat.png', 
		x: 			126, 
		y: 			40,
	};


	beforeEach('Sync DB.', () => db.sync({ force: true }) );

    beforeEach('Create an app.', () => {
        app = require('../../../server/app')(db);
        Project = 	db.model('project');
        Drawing = 	db.model('drawing');
        Text = 		db.model('text');
        Image = 	db.model('image');
        User = 		db.model('user');
    });

    beforeEach('Create a project with a Drawing, Text, and image.', function(done) {
        var createdProject;

        Project.create(ProjectInfo)
        .then( project => {
        	DrawingInfo.projectId 	= project.id;
        	TextInfo.projectId 		= project.id;
        	ImageInfo.projectId 	= project.id;

        	return Promise.all([ 	Drawing.create(DrawingInfo), 
        							Text.create(TextInfo),
        							Image.create(ImageInfo)
        							]);
        })
        .then( createdItems => { done() })
        .catch(done);
    });

    describe( 'Project route responds with created project when lat and long are in range.', () => { 

    	var projectAgent;
    	var responseProject;

        beforeEach('Create project agent', function() {
            projectAgent = supertest.agent(app);
        });

        it('should get a 200 response from the projects route', done => {
        	projectAgent.get('/api/projects/' + location.lat + '/' + location.long)
        	.expect(200)
        	.end( (err, response) => {
        		if(err) return done(err);
        		expect(response.body).to.be.an('array');
                expect(response.body[0].id).to.eql(ProjectInfo.id);
                expect(response.body.length).to.eql(1);
                responseProject = response.body[0];
                done();
        	})
        })

        it('returned project should include the associated Drawing with correct ID', () => {
        	responseProject.drawing.should.be.an('object')
        	responseProject.drawing.id.should.equal( DrawingInfo.id )
        })

        it('returned project should include the associated Text with correct ID', () => {
        	responseProject.texts.should.be.an('array')
        	responseProject.texts.should.have.length(1)
        	responseProject.texts[0].id.should.equal( DrawingInfo.id )
        })

        it('returned project should include the associated Image with correct ID', () =>{
        	responseProject.images.should.be.an('array')
        	responseProject.images.should.have.length(1)
        	responseProject.images[0].id.should.equal( ImageInfo.id )
        })

    });

    describe( 'Project route responds with no projects when the latitude is OUT of range', done => {

    	var projectAgent;

    	beforeEach('Create project agent', function() {
            projectAgent = supertest.agent(app);
        });

    	it('should get a 200 response from the projects route without any projects', done => {
        	var decimals = (projectRanges.inboxRange + '' ).split('.')[1].length;
        	var longRequest = location.long + projectRanges.inboxRange + Math.pow(10, -1 * decimals )
        	projectAgent.get('/api/projects/' + location.lat  + '/' + longRequest)
        	.expect(200)
        	.end( (err, response) => {
        		if(err) return done(err);
        		expect(response.body).to.be.an('array');
                expect(response.body.length).to.eql(0);
                done();
        	})
        })
    });

    describe( 'Project route responds with no projects when the longitude is OUT of range', done => {

    	var projectAgent;

    	beforeEach('Create project agent', function() {
            projectAgent = supertest.agent(app);
        });

    	it('should get a 200 response from the projects route without any projects', done => {
        	var decimals = (projectRanges.inboxRange + '' ).split('.')[1].length;
        	var latRequest = location.lat + projectRanges.inboxRange + Math.pow(10, -1 * decimals )
        	projectAgent.get('/api/projects/' + latRequest  + '/' + location.long)
        	.expect(200)
        	.end( (err, response) => {
        		if(err) return done(err);
        		expect(response.body).to.be.an('array');
                expect(response.body.length).to.eql(0);
                done();
        	})
        })
    });





})