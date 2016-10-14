'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('project', {
  latitude: {
    type: Sequelize.FLOAT
  },
  longitude: {
    type: Sequelize.FLOAT
  },
  angle: {
    type: Sequelize.INTEGER
  },
  tilt: {
    type: Sequelize.INTEGER
  }
});
