'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/members', require('./members')); //are you still using this route?? --KHGB
router.use('/drawings', require('./drawings'));
router.use('/locations', require('./locations'));
router.use('/users', require('./users'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res, next) {
    var err = new Error('Not found.');
    err.status = 404;
    next(err);
});
