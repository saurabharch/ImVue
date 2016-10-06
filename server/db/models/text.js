'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');


module.exports = db.define('text', {

  content: {
    type: Sequelize.STRING
  },
  border: {
    type: Sequelize.STRING
  },
  height: {
    type: Sequelize.INTEGER
  },
  width: {
    type: Sequelize.INTEGER
  },
  font: {
    type: Sequelize.STRING
  },
  color: {
    type: Sequelize.STRING
  },
  angle: {
    type: Sequelize.INTEGER
  }
});
