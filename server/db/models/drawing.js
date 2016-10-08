'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('drawing', {
  image: {
    type: Sequelize.TEXT
  }
});



// const drawings = [
// '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined',
// '300,600,800,600,orange,800,600,800,1000,orange,800,1000,300,1000,orange,300,1000,300,600,orange',
// '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow',
// '300,600,800,600,green,800,600,800,1000,green,800,1000,300,1000,green,300,1000,300,600,green',
// '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue',
// '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red',
// '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple',
// '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown'
// ];


// for(var i = 0; i< 50; i++) {
// 	var ri = Math.floor(Math.random() * drawings.length);
// 	var json = `{image: '${drawings[ri]}' }, `;
// 	console.log(json);
// }

