const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;

const User = require('../../../db/models/user.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');


router.get('/', (req, res, next) => {

    User.findAll()
        .then(Users => {
            res.send(Users)
        })
        .catch(next)
});

router.get('/:id', (req, res, next) => {

    User.findById(req.params.id, {
            include: [
                { model: Drawing },
                { model: Text },
                { model: Image }
            ]
        })
        .then(userSpecifiedData => {
            res.send(userSpecifiedData)
        })
        .catch(next)
});

router.post('/register', function(req, res, next) {

    User.create(req.body)
        .then(function(successfullySavedNewUser) {
            req.session.user = successfullySavedNewUser.dataValues;
            res.send(successfullySavedNewUser);
        })
});

router.delete('/:id', (req, res, next) => {
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
