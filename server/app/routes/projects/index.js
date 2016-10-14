const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Project = require('../../../db/models/project.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');
const User = require('../../../db/models/user.js');

router.get('/:lat/:lng', (req, res, next) => {
    var range = 0.0005; // ~92 meters http://www.csgnetwork.com/gpsdistcalc.html
    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lng);

    Project.findAll({
        where: {
            $and: {
                latitude: {
                    $between: [lat - range, lat + range]
                },
                longitude: {
                    $between: [lon - range, lon + range]
                }
            }
        },
        include: [
            { model: Drawing },
            { model: Text },
            { model: Image },
            { model: User }
        ]
    })
    .then(allInfo => res.send(allInfo))
    .catch(next);
});

router.post('/:lat/:lng/:ang/:tilt', (req, res, next) => {

    Project.create({
        where: {
            latitude: req.params.lat,
            longitude: req.params.lng,
            angle: req.params.ang,
            tilt: req.params.tilt,
            userId: req.user.id
        }
    })
    .then((project) => {
        
        var creatingAll = [];

        if (req.body.drawing.image.length){
            req.body.drawing.projectId = project.id;
            creatingAll.push( Drawing.create( req.body.drawing ) );
        }

        if (req.body.texts.length ){
            for( let i = 0; i < req.body.texts.length ; i++){
                req.body.texts[i].projectId = project.id;
                creatingAll.push( Text.create(req.body.texts[i]) );
            }
        } 

        if ( req.body.images.length ){
            for( let i = 0; i < req.body.images.length ; i++){
                req.body.images[i].projectId = project.id;
                creatingAll.push( Image.create(req.body.images[i]) );
            }
        }

        return Promise.all(creatingAll); // eslint-disable-line new-cap
    })
    .then( createdItems => { })
    .then(() => res.sendStatus(201))
    .catch(next);
});
