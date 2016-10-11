const router = require('express').Router() // eslint-disable-line new-cap
module.exports = router;

const User = require('../../../db/models/user.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');


router.get('/', (req, res, next) => {
    console.log('Retriving All Users') //kill this
    User.findAll()
        .then(Users => {
            res.send(Users) //you didn't sanitize?!?!?!?!?!?! -- KHGB
        })
        .catch(next) //catching :)
});

router.get('/:id', (req, res, next) => {
    console.log('Retriving User number #{req.params.id}')
    User.findById( req.params.id, { include: [
            {model: Drawing},
            {model: Text},
            {model: Image}
        ]})
        .then(userSpecifiedData => {
            res.send(userSpecifiedData) //also sanitize meeeee -- KHGB
        })
        .catch(next)
});

//why am I in here but commented out?? -- KHGB
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
//if this is the signup route, I would expect it to be where login is so that you can utilize passport more easily
    console.log(req.body)

    User.create(req.body)
        .then(function(successfullySavedNewUser) {
            req.session.user = successfullySavedNewUser.dataValues; //use passport! Don't manually set this

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
        .then((res, next) => { //res, next are NOT these params. Change this!
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
        .then(user => { //user is not what is sent back, it is an array with a rowCount and then the updated user IF you use the returning: true option
            res.send(user)
        })
        .catch(next)
})

router.get('/:userId/drawings', (req, res, next) => {
    //are the following comments still applicable? I see the association already existing -- KHGB
    // WE HAVEN'T SETUP THE ASSOCIATION BETWEEN USER AND DRAWINGS
    // THIS ROUTE IS CURRENTLY NOT WORKING
    // ref => profile.factory.js
   
    //We are in the user route, so I would assume you would search for the user by id and then include the drawing model
        //with that said, I would expect one for text/image as well. All of these could be queries for this route --> which would actually mean that this route could be combined with the route on line 19!!
    Drawing.findAll({
        where: {
            userId: req.params.userId
        }
    }).then((drawings) => {
        res.send(drawings)
    }).catch(next)

});
