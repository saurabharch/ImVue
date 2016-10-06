'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('drawing', {
// <<<<<<< HEAD
//   stroke: {
//     type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.INTEGER))
// =======
//   strokes: {
//     type: Sequelize.STRING
// >>>>>>> master
//   },
  angle: {
    type: Sequelize.INTEGER
  },
    latitude: {
      type: Sequelize.FLOAT
    },
    longitude: {
      type: Sequelize.FLOAT
    },
    directoryPath:{
        type: Sequelize.STRING
    },
    image:{
      type:Sequelize.TEXT
    }
});



// var Image_Store = sequelize.define('image', {
//   image_id: {
//     type: Sequelize.INTEGER
//   },
//   image_type: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   image: {
//     type: Sequelize.BLOB('long')
//   },
//   image_size: {
//     type: Sequelize.INTEGER
//   },
//   image_name: {
//     type: Sequelize.STRING
//   }
// });
