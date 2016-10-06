'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('drawing', {
  angle: {
    type: Sequelize.INTEGER
  },
  latitude: {
    type: Sequelize.FLOAT
  },
  longitude: {
    type: Sequelize.FLOAT
  },
  directoryPath: {
      type: Sequelize.STRING
  },
  image: {
    type: Sequelize.TEXT
  }
});
