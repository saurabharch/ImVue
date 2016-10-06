'use strict';
var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');
var Location_Drawing = require('./models/location_drawing');
var Location = require('./models/location');
var Drawing = require('./models/drawing');

Location.belongsToMany(Drawing, {through: Location_Drawing});
Drawing.belongsToMany(Location, {through: Location_Drawing});
Drawing.belongsTo(User, {as: 'Artist'})
Drawing.belongsTo(User, {as: 'Viewer'})
User.hasMany(Drawing);
