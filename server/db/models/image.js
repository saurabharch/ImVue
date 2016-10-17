'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('image', {
    source: {
        type: Sequelize.STRING
    },
    x: { // eslint-disable-line id-length
        type: Sequelize.INTEGER
    },
    y: { // eslint-disable-line id-length
        type: Sequelize.INTEGER
    }
});
