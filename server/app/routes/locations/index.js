const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Location = require('../../../db/models/location.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');
const User = require('../../../db/models/user.js');

router.get('/:lat/:lng', (req, res, next) => { //long. isn't a sub-resource of lat. As well as the fact that we are filtering/finding a range which is for queries in a RESTful API. With that, these would be best as queries rather than params. 
    var range = 0.0005; // ~92 meters http://www.csgnetwork.com/gpsdistcalc.html
    var lat = parseFloat(req.params.lat);
    var lon = parseFloat(req.params.lng);

    Location.findAll({
        where: {
            $and: {
                latitude: {
                    $between: [lat - range, lat + range]
                },
                longitude: {
                    $between: [lon - range, lon + range]
                }
            }
        },
        include: [
            {model: Drawing, include: [{model: User}]},
            {model: Text, include: [ {model: User} ]},
            {model: Image, include: [ {model: User} ]}
        ]
    })
        .then(allInfo => res.send(allInfo))
        .catch(next);
});

router.post('/:lat/:lng', (req, res, next) => { //This seems to me like it makes the most sense in the drawing (and future image/text) routes. Save the item and populate the location. With that, the rest of the comments are unimportant for this route


    Location.findOrCreate({
        where: {
            latitude: req.params.lat,
            longitude: req.params.lng,
            angle: req.params.ang || null,
            tilt: req.params.tilt || null
        }
    })
        .spread((location) => {
            console.log('location:', location ); //kill this
            var creatingAll = []; //Can you have multiple items in a single post? Does this array make the most sense? If you can have multiple, can you have multiple of a single type (drawing, text, image?)
            if (req.body.drawing) creatingAll.push(location.createDrawing( req.body.drawing));
            if (req.body.text) creatingAll.push(location.createText(req.body.text));
            if (req.body.image) creatingAll.push(location.createImage(req.body.image));

            return Promise.all(creatingAll); // eslint-disable-line new-cap
        })
        .then(createdItems => {
            createdItems.forEach( item => { item.setUser(req.user.id) })
        })
        .then(() => res.redirect('/')) //maybe don't redirect and have a $state.go on the front, so you can display a message of success and then go to the next state. I dkn I just want the user to know they posted successfully. Maybe it doesn't matter -- KHGB
        .catch(next);
});
