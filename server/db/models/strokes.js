'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('stroke', {
  dots: {
    type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.INTEGER))
  },
  color: {
    type: Sequelize.STRING
  },
  font: {
    type: Sequelize.STRING
  }
});
