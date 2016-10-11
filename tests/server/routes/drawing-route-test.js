// const router = require('express').Router() // eslint-disable-line new-cap
// module.exports = router;
// const Drawing = require('../../../db/models/drawing.js')
// const Location = require('../../../db/models/location.js')
//
//
// router.post('/', (req, res, next) => {
//     Location.create({
//         latitude: req.body.location.coords.latitude,
//         longitude:  req.body.location.coords.longitude
//     })
//         .then(function(location) {
//             return location.createDrawing(req.body.image);
//         })
//         .then( drawing => { res.send(drawing) })
//         .catch(next)
// });
const expect = require('chai').expect;
const Sequelize = require('sequelize');
const db = require('../../../server/db');
const supertest = require('supertest');
const Drawing = db.model('drawing');
const Location = db.model('location');



describe('Drawing Route', ()=> {

    var app, savedImages, agent;

    beforeEach('Sync DB', function () {
        return db.sync({force: true});
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        savedImages = db.model('drawing');
        agent = supertest.agent(app);
    });
    let location ={}

    let locationDrawing = {
        location:{
            coords:{
                latitude:49.705778,
                longitude:74.008235
            }
        },
        angle: 179,
        tilt: 78,
        image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow'
    }


    it('Post to drawings route', (done) => {
        return agent.post('/api/drawings')
            .send(locationDrawing)
            // .expect(201)
            .end( (err, res) => {
                console.log('HERERERERERE')
                if (err) return done(err);
            expect(res.body.image).to.equal('300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow');
            expect(res.body.longitude).to.exist;

            Drawing.findById(res.body.id)
                .then((b) => {
                    console.log(b)
                    expect(b).to.not.be.null;
                    expect(res.body).to.eql(toPlainObject(b));
                    done();
                })
                .catch(done);
        });

    })
})

        // {latitude: 40.705665, longitude: -74.008604, angle: 217, tilt: -9, image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' }
        //
        // {latitude: 40.705805, longitude: -74.008770, angle: 21, tilt: -25, image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' }
        //
        // router.post('/', (req, res, next) => {
        //     Location.create({
        //         latitude: req.body.location.coords.latitude,
        //         longitude:  req.body.location.coords.longitude
        //     })
        //         .then(function(location) {
        //             return location.createDrawing(req.body.image);
        //         })
        //         .then( drawing => { res.send(drawing) })
        //         .catch(next)
        // });

    //
    //
    //
    // }
    //     var seedData = [{image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,orange,800,600,800,1000,orange,800,1000,300,1000,orange,300,1000,300,600,orange' },
    //         {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
    //         {image: '300,600,800,600,green,800,600,800,1000,green,800,1000,300,1000,green,300,1000,300,600,green' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,orange,800,600,800,1000,orange,800,1000,300,1000,orange,300,1000,300,600,orange' },
    //         {image: '300,600,800,600,green,800,600,800,1000,green,800,1000,300,1000,green,300,1000,300,600,green' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
    //         {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
    //         {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
    //         {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
    //         {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
    //         {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' }]
    //
    // return savedImages.bulkCreate(seedData).then(() => {
    //     console.log('seed images saved')
    // })
    // });
    //
    //
    // const router = require('express').Router() // eslint-disable-line new-cap
    // module.exports = router;
    // const Drawing = require('../../../db/models/drawing.js')
    // const Location = require('../../../db/models/location.js')
    //
    //
    // router.post('/', (req, res, next) => {
    //     Location.create({
    //         latitude: req.body.location.coords.latitude,
    //         longitude:  req.body.location.coords.longitude
    //     })
    //         .then(function(location) {
    //             return location.createDrawing(req.body.image);
    //         })
    //         .then( drawing => { res.send(drawing) })
    //         .catch(next)
    // });
    //


    //
    // it('drawing route returns all the image data',()=> {
    //     // return agent.post('/api/drawings').then((info) => {
    //     //     console.log(info);
    //     // })
    //     aget.get('/:lat/:lng', (req, res, next) => {
//     // })
// });
