'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

//consider validations like allowNull - I am assuming if this is an entry it should HAVE to have an 'image' -- KHGB
module.exports = db.define('drawing', {
  image: { //maybe have this as 'content' for consistency? -- KHGB
    type: Sequelize.TEXT //why text here and string in the drawing/text ?? Maybe consider blob if it is just binary text -- KHGB
  }
});
