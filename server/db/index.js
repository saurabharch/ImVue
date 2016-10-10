'use strict';
const db = require('./_db');
const User = require('./models/user');
const Location = require('./models/location');
const Drawing = require('./models/drawing');
const Text = require('./models/text');
const Image = require('./models/image');

module.exports = db;

Location.hasMany(Drawing);
Location.hasMany(Text);
Location.hasMany(Image);
// Location.hasMany(User, {as: 'author'});

Drawing.belongsTo(Location);
Text.belongsTo(Location);
Image.belongsTo(Location);


Drawing.belongsTo(User);
Text.belongsTo(User);
Image.belongsTo(User);

User.hasMany(Drawing);
User.hasMany(Text);
User.hasMany(Image);
