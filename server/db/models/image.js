'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

//consider validations like allowNull - I am assuming if this is an entry it should HAVE to have an 'source', 'x', 'y' -- KHGB
module.exports = db.define('image', {
  source: { //maybe content as well for consistency -- KHGB
    type: Sequelize.STRING
  },
  x: {	// eslint-disable-line id-length
    type: Sequelize.INTEGER
  },
  y: {	// eslint-disable-line id-length
    type: Sequelize.INTEGER
  }
});
