const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;
const Strokes =  require('../../../db/models/strokes.js')

router.get('/', (req, res, next) => {
    console.log('Retriving All Strokes')
    Strokes.findAll()
        .then( strokes => {
            res.send(strokes)
        })
        .catch(next)
})


router.get('/:id', (req, res, next) => {
    console.log('Retriving strokes number #{req.params.id}')
    Strokes.findById(req.params.id)
        .then( stroke => { res.send(stroke) })
        .catch(next)
})

router.post('/', (req, res, next) => {

    let newStroke = req.body
    Strokes.create(newStroke)
        .then( stroke => { res.send(stroke) })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    console.log('Destoying stroke #{req.params.id}')
    Strokes.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((res, next) => { res.status(204).send('') })
        .catch(next)

})

router.put('/:id', ( req, res, next ) => {
    //let updatedStroke = req.body
    // Location.update(updatedStroke, {
    //     where: { id: req.params.id }
    // })
    //     .then( stroke => { res.send(stroke) })
    //     .catch(next)

})
