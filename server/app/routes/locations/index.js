const router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
const Location = require('../../../db/models/location.js');
const Drawing = require('../../../db/models/drawing.js');
const Text = require('../../../db/models/text.js');
const Image = require('../../../db/models/image.js');
const User = require('../../../db/models/user.js');

router.get('/:lat/:lng', (req, res, next) => {
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

router.post('/:lat/:lng/:ang/:tilt', (req, res, next) => {
    Location.findOrCreate({
        where: {
            latitude: req.params.lat,
            longitude: req.params.lng,
            angle: req.params.ang || null,
            tilt: req.params.tilt || null
        }
    })
        .spread((location) => {
            console.log('location:', location );
            var creatingAll = [];
            if (req.body.drawing) creatingAll.push(location.createDrawing( req.body.drawing));
            if (req.body.text) creatingAll.push(location.createText(req.body.text));
            if (req.body.image) creatingAll.push(location.createImage(req.body.image));

            return Promise.all(creatingAll); // eslint-disable-line new-cap
        })
        .then(createdItems => {
            createdItems.forEach( item => { item.setUser(req.user.id) })
        })
        .then(() => res.redirect('/'))
        .catch(next);
});
