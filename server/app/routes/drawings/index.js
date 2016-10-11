const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;
const Drawing = require('../../../db/models/drawing.js') //I emphatically recommend AGAINST this. Chose one of the following : 
    //require in the db (require('../../../db')) and export the models from there so we know the associations have already run
    //require in the db and use db.model('drawing')
    //require in the db and use db.models.drawing
const Location = require('../../../db/models/location.js')


router.post('/', (req, res, next) => {
    //Because this is the drawing router, I would think you would created the drawing and associate the location -- KHGB
    Location.create({
        latitude: req.body.location.coords.latitude,
        longitude:  req.body.location.coords.longitude
    })
        .then(function(location) {
            return location.createDrawing(req.body.image);
        })
        .then( drawing => { res.send(drawing) })
        .catch(next) //LOVE CATCHING ERRORS -- KHGB
});

router.get('/:id', (req, res, next) => {

    Drawing.findById(req.params.id)
        //Drawing (with the capital) as the param when you already have a variable with that name is RISKY. Don't do it!
        .then( Drawing => { res.send(Drawing) })    // eslint-disable-line no-shadow
        .catch(next)
})

router.get('/:id/image', (req, res, next) => {

    Drawing.findById(req.params.id)
        //Drawing (with the capital) as the param when you already have a variable with that name is RISKY. Don't do it!
        //What is this directoryPath?
        .then( Drawing => { res.sendFile(Drawing.directoryPath) })  // eslint-disable-line no-shadow
        .catch(next)
})


router.delete('/:id', (req, res, next) => {
    console.log('Destoying drawing #{req.params.id}') //console logs should NOT be in master -- KHGB
    Drawing.destroy({
        where: { id: req.params.id }
    })
    .then((res, next) => { //these parameters are NOT res and next, you already have those defined. What is returned is actually the number of rows deleted. CHANGE THESE NAMES
        res.status(204).send('') //sendStatus will be what you want; 204 means no content, so there should be NO content
    })
    .catch(next)

})

router.put('/:id', ( req, res, next ) => {
    let updatedDrawing = req.body
    Drawing.update(updatedDrawing, {
        where: {
            id: req.params.id
        }
    }) //with this you need a 'returning: true' option to get the updated drawing back. This promise will resolve to a rowCount as the first param and the updatedDrawing as the second.
        .then(drawing => {
            res.send(drawing)
        })
        .catch(next)

})

