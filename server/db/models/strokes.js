'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('stroke', {
  dots: {
    type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.INTEGER)) // eslint-disable-line new-cap
  },
  color: {
    type: Sequelize.STRING
  },
  font: {
    type: Sequelize.STRING
  }
});
