'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('location', {
  latitude: {
    type: Sequelize.FLOAT
  },
  longitude: {
    type: Sequelize.FLOAT
  },
  heading: {
    type: Sequelize.FLOAT
  }
});
