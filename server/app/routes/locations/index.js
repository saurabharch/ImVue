const router = require('express').Router();
module.exports = router;
const Location = require('../../../db/models/location.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');

router.get('/:lat/:lng', (req, res, next) => {
    var range = 2000 / 100000;
    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lng);

    Location.findAll({
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
            {model: Drawing},
            {model: Text},
            {model: Image}
        ]
    })
        .then(allInfo => res.send(allInfo))
        .catch(next);
});


router.post('/:lat/:lng', (req, res, next) => {
    Location.findOrCreate({
        latitude: req.params.lat,
        longitude: req.params.lng,
        angle: req.params.ang || null,
        tilt: req.params.tilt || null
    })
        .then((location) => {
            var creatingAll = [];
            if (req.body.drawing) creatingAll.push(location.createDrawing(req.body.drawing));
            if (req.body.text) creatingAll.push(location.createText(req.body.text));
            if (req.body.image) creatingAll.push(location.createImage(req.body.image));

            return Promise.all(creatingAll)
        })
        .then(createdItems => res.send(createdItems))
        .catch(next);
});





// router.get('/:id', (req, res, next) => {
//     console.log('Retriving drawing number #{req.params.id}')
//     Location.findById(req.params.id)
//         .then(Location => {
//             res.send(Location)
//         })
//         .catch(next)
// })

// router.post('/', (req, res, next) => {
//     console.log('Creating new location')
//     let newLocation = req.body
//     Location.create(newLocation)
//         .then(location => {
//             res.send(location)
//         })
//         .catch(next)
// })

// router.delete('/:id', (req, res, next) => {
//     console.log('Destoying location #{req.params.id}')
//     Location.destroy({
//             where: {
//                 id: req.params.id
//             }
//         })
//         .then((res, next) => {
//             res.status(204).send('')
//         })
//         .catch(next)

// })

// router.put('/:id', (req, res, next) => {
//     let updatedLocation = req.body
//     Location.update(updatedLocation, {
//             where: {
//                 id: req.params.id
//             }
//         })
//         .then(location => {
//             res.send(location)
//         })
//         .catch(next)

// })

// router.get('/', (req, res, next) => {
//     console.log('Retriving All Location')
//     Location.findAll()
//         .then(Locations => {
//             res.send(Locations)
//         })
//         .catch(next)
// })