const router = require('express').Router()
module.exports = router;
const Texts =  require('../../../db/models/text.js')

router.get('/', (req, res, next) => {
    console.log('Retriving All Text')
    Texts.findAll()
        .then( texts => {
            res.send(text)
        })
        .catch(next)
})


router.get('/:id', (req, res, next) => {
    console.log('Retriving strokes text #{req.params.id}')
    Texts.findById(req.params.id)
        .then( text => {
            res.send(text)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    console.log('Creating new stroke')
    let newTexts = req.body
    Texts.create(newTexts)
        .then( text => {
            res.send(text)
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    console.log('Destoying text #{req.params.id}')
    Texts.destroy({
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
    let updatedText = req.body
    Location.update(updatedText, {
        where: {
            id: req.params.id
        }
    })
        .then(text => {
            res.send(text)
        })
        .catch(next)

})
