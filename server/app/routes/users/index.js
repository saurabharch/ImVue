const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;

const User = require('../../../db/models/user.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');


router.get('/', (req, res, next) => {
    console.log('Retriving All Users')
    User.findAll()
        .then(Users => {
            res.send(Users)
        })
        .catch(next)
});

router.get('/:id', (req, res, next) => {
    console.log('Retriving User number #{req.params.id}')
    User.findById( req.params.id, { include: [
            {model: Drawing},
            {model: Text},
            {model: Image}
        ]})
        .then(userSpecifiedData => {
            res.send(userSpecifiedData)
        })
        .catch(next)
});

// router.post('/', (req, res, next) => {
//     console.log('Creating new User')
//     let newUser = req.body
//     User.create(newUser)
//         .then(user => {
//             res.send(user)
//         })
//         .catch(next)
// })

router.post('/register', function(req, res, next) {

    console.log(req.body)

    User.create(req.body)
        .then(function(successfullySavedNewUser) {
            req.session.user = successfullySavedNewUser.dataValues;

            console.log( 'User registered on the session as', req.session.user)
            res.send(successfullySavedNewUser);
        })
});

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

router.get('/:userId/drawings', (req, res, next) => {
    // WE HAVEN'T SETUP THE ASSOCIATION BETWEEN USER AND DRAWINGS
    // THIS ROUTE IS CURRENTLY NOT WORKING
    // ref => profile.factory.js
    Drawing.findAll({
        where: {
            userId: req.params.userId
        }
    }).then((drawings) => {
        res.send(drawings)
    }).catch(next)

});
