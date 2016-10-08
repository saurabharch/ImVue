'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('image', {
  source: {
    type: Sequelize.STRING
  },
  x: {
    type: Sequelize.INTEGER
  },
  y: {
    type: Sequelize.INTEGER
  }
});


// for(var i = 0; i< 50; i++) {
// 	var s = `http://lorempixel.com/${Math.floor(500 * Math.random())}/${Math.floor(500 * Math.random())}/animals/`
// 	var json = `{source: '${s}', x: ${Math.floor(Math.random() * 250)}, y: ${Math.floor(Math.random() * 250)}}, `;
// 	console.log(json);
// }
