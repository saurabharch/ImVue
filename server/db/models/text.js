'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('text', {
  font: {
    type: Sequelize.ENUM(['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'serif', 'sans-serif'])
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
  x: {
    type: Sequelize.INTEGER
  },
  y: {
    type: Sequelize.INTEGER
  }
});



// var font = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'serif', 'sans-serif'];
// var size = 150;
// var color = ['yellow', 'white', 'black', 'red', 'green', 'blue', 'purple'];
// var x = 1000;
// var y = 1000;


// for(var i = 0; i < 50; i++) {
// 	var f = font[Math.floor(Math.random()*font.length)];
// 	var s = Math.floor(size * Math.random());
// 	var c = color[Math.floor(Math.random()*color.length)];
// 	var posX = Math.floor(Math.random() * x);
// 	var posY = Math.floor(Math.random() * y);

// 	var json = `{font: '${f}', size: ${s}, color: '${c}', x: ${posX}, y: ${posY}}, `;

// 	console.log(json);
// };
