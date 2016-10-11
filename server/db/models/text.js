'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

// required fields? -- KHGB
module.exports = db.define('text', {
  font: {
    type: Sequelize.ENUM(['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'serif', 'sans-serif']) // eslint-disable-line new-cap
  },
  content: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.INTEGER
  },
  color: {
    type: Sequelize.STRING
  },
  x: {  // eslint-disable-line id-length
    type: Sequelize.INTEGER
  },
  y: {  // eslint-disable-line id-length
    type: Sequelize.INTEGER
  }
});
