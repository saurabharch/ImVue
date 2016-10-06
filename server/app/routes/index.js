'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/members', require('./members'));
router.use('/drawings', require('./drawings'));
router.use('/locations', require('./locations'));
router.use('/strokes', require('./strokes'));
router.use('/texts', require('./strokes'));


// Make sure this is after all of
// the registered routes!
router.use(function (req, res, next) {
    var err = new Error('Not found.');
    err.status = 404;
    next(err);
});
