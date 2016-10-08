const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;
const Drawing = require('../../../db/models/drawing.js');
const User = require('../../../db/models/user.js');

router.get('/', (req, res, next) => {


    console.log('Retriving All Users')
    User.findAll()
        .then(Users => {
            res.send(Users)
        })
        .catch(next)
})

console.log("hit users route")
router.get('/:id/drawings', (req, res, next) => {

    console.log("H!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    Drawing.findAll({
        where:{
            userId:req.params.id
        }
    }).then((drawings) => {

        console.log("These are the drawings I found", drawings)
        res.send(drawings)
    }).catch(next)

})

router.get('/:id', (req, res, next) => {
    console.log('Retriving User number #{req.params.id}')
    User.findById(req.params.id)
        .then(User => {
            res.send(User)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    console.log('Creating new User')
    let newUser = req.body
    User.create(newUser)
        .then(user => {
            res.send(user)
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    console.log('Destoying User #{req.params.id}')
    User.destroy({
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
    let updatedUser = req.body
    User.update(updatedUser, {
        where: {
            id: req.params.id
        }
    })
        .then(user => {
            res.send(user)
        })
        .catch(next)
})


// router.get('/ping/:longitude/:latitude', (req, res, next) => {
//     var range = 2000 / 100000;
//     var lat = parseFloat(req.params.latitude);
//     var lon = parseFloat(req.params.longitude);
//
//     Drawing.findAll({
//         where: {
//             $and: {
//                 latitude: {
//                     $between: [lat - range, lat + range]
//                 },
//                 longitude: {
//                     $between: [lon - range, lon + range]
//                 }
//             }
//         }
//     })
//         .then(drawings => res.send(drawings))
//         .catch(next);
// })
