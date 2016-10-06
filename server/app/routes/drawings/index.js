var _ = require('lodash')
const router = require('express').Router()
module.exports = router;
const Drawing = require('../../../db/models/drawing.js')
const Location = require('../../../db/models/location.js')
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// router.get('/', (req, res, next) => {
//     console.log('Retriving All Drawings')
//     // Drawing.findAll()
//     //     .then( Drawings => {
//     //         res.send(Drawings)
//     //     })
//     //     .catch(next)
//
//     Drawing.findById(_.random(1,20))
//         .then( drawing => {
//             res.sendFile(drawing.directoryPath);
//         }).catch(next)
//
// })


router.get('/', (req, res, next) => {
    console.log('Retriving All Drawings info')
    // Drawing.findAll()
    //     .then( Drawings => {
    //         res.send(Drawings)
    //     })
    //     .catch(next)

    Drawing.findAll()
        .then( drawings => {
            console.log(drawings)
                res.send(JSON.stringify(drawings));
        }).catch(next)

})

router.get('/:id', (req, res, next) => {
    console.log('Retriving drawing number'+ req.params.id)
    Drawing.findById(req.params.id)
        .then( Drawing => {
            res.send(Drawing)
        })
        .catch(next)
})

router.get('/:id/image', (req, res, next) => {
    console.log('Retriving drawing number #{req.params.id}')
    Drawing.findById(req.params.id)
        .then( Drawing => {
            res.sendFile(Drawing.directoryPath)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    console.log('Creating new drawing')
    console.log("Location",req.body.longitude)
    console.log("Location",req.body.latitude)
    // var json = JSON.stringify(req.body)
    // console.log(json)


    // var imageData = FS.readFileSync(__dirname + '/123_icon.png');
    Drawing.create(req.body)
        .then( drawing => {
            //console.log(drawing)

            res.send(drawing)
        })
        .catch(next)
})

router.post('/longitude/:longitudeNum/latitude/:latitudeNum', (req, res, next) => {
    console.log('Creating new drawing')
    //console.log(req.body)

    console.log('longitude', req.params.longitudeNum)
    console.log('latitude', req.params.latitudeNUm)

    Location.findOrCreate({
        where:{longitude:req.params.longitudeNum,latitude:req.params.latitudeNum}
    }).spread(function(found,  created){
        console.log('found', found, 'created',created)
        res.send(found)
    }).catch(next)


    // var json = JSON.stringify(req.body)
    // console.log(json)


    // var imageData = FS.readFileSync(__dirname + '/123_icon.png');
//     Drawing.create(req.body)
//         .then( drawing => {
//             //console.log(drawing)
//
//             res.send(drawing)
//         })
//         .catch(next)
})


router.delete('/:id', (req, res, next) => {
    console.log('Destoying drawing #{req.params.id}')
    Drawing.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((res, next) => {
            res.status(204).send('')
        })
        .catch(next)

})

router.put('/:id', ( req, res, next ) => {
    let updatedDrawing = req.body
    Drawing.update(updatedDrawing, {
        where: {
            id: req.params.id
        }
    })
        .then(drawing => {
            res.send(drawing)
        })
        .catch(next)

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

