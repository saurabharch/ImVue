'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

//any required fields here?? -- KHGB
module.exports = db.define('location', {
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

//what is going on here? Do you really want this on master? -- KHGB
// var lat = 40.7052983;
// var lon = -74.0091516;
// var range = .001;

// for(var i = 0; i< 50; i++) {
// 	var coordLat = (lat + (range * Math.random())).toFixed(6);
// 	var coordLon = (lon + (range * Math.random())).toFixed(6);
// 	var angle = Math.floor(Math.random() * 360);
// 	var tilt = Math.floor(Math.random() * 360) - 180;

// 	var json = `{latitude: ${coordLat}, longitude: ${coordLon}, angle: ${angle}, tilt: ${tilt}}, `;
// 	console.log(json);
// }
