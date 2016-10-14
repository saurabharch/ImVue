const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;
const Drawing = require('../../../db/models/drawing.js')
const Project = require('../../../db/models/project.js')

router.post('/', (req, res, next) => {
    Project.create({
        latitude: req.body.project.coords.latitude,
        longitude:  req.body.project.coords.longitude
    })
        .then(function(Project) {
            return Project.createDrawing(req.body.image);
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

