const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;
const Drawing = require('../../../db/models/drawing.js')
const Location = require('../../../db/models/location.js')


router.post('/', (req, res, next) => {
    Location.create({
        latitude: req.body.location.coords.latitude,
        longitude:  req.body.location.coords.longitude
    })
        .then(function(location) {
            return location.createDrawing(req.body.image);
        })
        .then( drawing => { res.send(drawing) })
        .catch(next)
});





























router.get('/:id', (req, res, next) => {

    Drawing.findById(req.params.id)
        .then( Drawing => { res.send(Drawing) })    // eslint-disable-line no-shadow
        .catch(next)
})

router.get('/:id/image', (req, res, next) => {

    Drawing.findById(req.params.id)
        .then( Drawing => { res.sendFile(Drawing.directoryPath) })  // eslint-disable-line no-shadow
        .catch(next)
})


router.delete('/:id', (req, res, next) => {
    console.log('Destoying drawing #{req.params.id}')
    Drawing.destroy({
        where: { id: req.params.id }
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

