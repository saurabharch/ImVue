'use strict';
var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');

var Location = require('./models/location');
var Drawing = require('./models/drawing');
var Stroke = require('./models/strokes');
var Text = require('./models/text');

Location.belongsToMany(Drawing, {through: Location_Drawing});
Drawing.belongsToMany(Location, {through: Location_Drawing});
Drawing.belongsTo(User, {as: 'Artist'})
Drawing.belongsTo(User, {as: 'Viewer'})
User.hasMany(Drawing);


// // drawing.getLocation(), text.getLocation()
// // usage: best text or drawing of the day
// Location.hasMany(Text);
// Text.belongsTo(Location);


// //drawing.getStrokes()
// Drawing.hasMany(Stroke);
// Stroke.belongsTo(Drawing)
