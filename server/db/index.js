'use strict';
var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');

var Location = require('./models/location');
var Drawing = require('./models/drawing');
var Stroke = require('./models/strokes');
var Text = require('./models/text');

// Drawing and Text has locationId inside of the table
// location.getDrawings(), location.getTexts()
Location.hasMany(Drawing);
Location.hasMany(Text);
//
// // drawing.getLocation(), text.getLocation()
// // usage: best text or drawing of the day
Drawing.belongsTo(Location);
Text.belongsTo(Location);
//
// //drawing.getStrokes()
Drawing.hasMany(Stroke);

Stroke.belongsTo(Drawing)

// if we had more models, we could associate them in this file
// e.g. User.hasMany(Reports)

//
// var Location = require('./models/location');
// var Drawing = require('./models/drawing');
// // var Stroke = require('./models/stroke');
// var Text = require('./models/text');
//
// // Drawing and Text has locationId inside of the table
// // location.getDrawings(), location.getTexts()
// Location.hasMany(Drawing);
// Location.hasMany(Text);
//
// // drawing.getLocation(), text.getLocation()
// // usage: best text or drawing of the day
// Drawing.belongsTo(Location);
// Text.belongsTo(Location);
//
// //drawing.getStrokes()
// // Drawing.hasMany(Stroke);
