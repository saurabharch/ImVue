const router = require('express').Router()
module.exports = router;
const Location = require('../../../db/models/location.js')

router.get('/', (req, res, next) => {
    console.log('Retriving All Location')
    Location.findAll()
        .then(Locations => {
            res.send(Locations)
        })
        .catch(next)
})

router.get('/ping/:longitude/:latitude', (req, res, next) => {
    console.log('Longitude', req.params.longitude, 'Latitude', req.params.latitude)
    Location.findAll({
        where: {
            latitude: {
                $between: [+req.params.latitude - 2000, +req.params.latitude + 2000]
            },
            longitude: {
                $beween: [+req.params.longitude - 2000, +req.params.longitude + 2000]
            }
            // altitude: {
            //   $beween: [+req.params.alt - 2000, +req.params.alt + 2000]
            // }
        }
    })
        .then(function (locations) {
            console.log(locations)
                var gettingDrawings = locations.map(loc => loc.getDrawings());
                return Promise.all(gettingDrawings)
        })
        .then(function (drawings) {
            console.log(drawings)
            res.send(drawings);
        })
        // Location.findAll()
        //     .then( Locations => {
        //         res.send(Locations)
        //     })
        //     .catch(next)
})

// var router = require('express').Router(); // eslint-disable-line new-cap
// module.exports = router;
// var _ = require('lodash');
// var Location = require('../../../db/models/location');

// router.get('/:lat/:lon/:alt', function(req, res, next) {
//   // var location = req.params.currentLocation; //ex, '40712843N   74005952W'
//
//   //slice the last digits, so that we can retrieve multiple data
//   Location.findAll({
//     where: {
//        latitude: {
//          $between: [+req.params.lat - 2000, +req.params.lat + 2000]
//        },
//        longitude: {
//          $beween: [+req.params.lon - 2000, +req.params.lon + 2000]
//        },
//        altitude: {
//          $beween: [+req.params.alt - 2000, +req.params.alt + 2000]
//        }
//     }
//   })
//     .then(function(locations) {
//       var gettingDrawings = locations.map(loc => loc.getDrawings());
//       return Promise.all(gettingDrawings)
//     })
//     .then(function(drawings) {
//       res.send(drawings);
//     })
// });
//
//
// router.post('/:lat/:lon/:alt', function(req, res, next) {
//   var drawing = req.body;
//
//   Location.create({
//     latitude: req.params.lat,
//     longitude: req.params.lon,
//     altitude: req.params.alt
//   })
//     .then(function(location) {
//       return location.addDrawing(req.body)
//     })
//     .then(function(createdDrawing) {
//       res.send(createdDrawing);
//     })
// })







router.get('/:id', (req, res, next) => {
    console.log('Retriving drawing number #{req.params.id}')
    Location.findById(req.params.id)
        .then(Location => {
            res.send(Location)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    console.log('Creating new location')
    let newLocation = req.body
    Location.create(newLocation)
        .then(location => {
            res.send(location)
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    console.log('Destoying location #{req.params.id}')
    Location.destroy({
            where: {
                id: req.params.id
            }
        })
        .then((res, next) => {
            res.status(204).send('')
        })
        .catch(next)

})

router.put('/:id', (req, res, next) => {
    let updatedLocation = req.body
    Location.update(updatedLocation, {
            where: {
                id: req.params.id
            }
        })
        .then(location => {
            res.send(location)
        })
        .catch(next)

})