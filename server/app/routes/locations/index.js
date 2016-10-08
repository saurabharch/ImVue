const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;
// const Location = require('../../../db/models/location.js');
const Drawing = require('../../../db/models/drawing.js');

// router.get('/', (req, res, next) => {
//     console.log('Retriving All Location')
//     Location.findAll()
//         .then(Locations => {
//             res.send(Locations)
//         })
//         .catch(next)
// })

router.get('/ping/:longitude/:latitude', (req, res, next) => {
    var range = 2000 / 100000;
    var lat = parseFloat(req.params.latitude);
    var lon = parseFloat(req.params.longitude);

    Drawing.findAll({
        where: {
            $and: {
                latitude: {
                    $between: [lat - range, lat + range]
                },
                longitude: {
                    $between: [lon - range, lon + range]
                }
            }
        }
    })
        .then(drawings => res.send(drawings))
        .catch(next);
})

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
