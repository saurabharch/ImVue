'use strict';
const db = require('./_db');
const User = require('./models/user');
const Location = require('./models/location');
const Drawing = require('./models/drawing');
const Text = require('./models/text');
const Image = require('./models/image');

module.exports = db;
// module.exports = {db, User, Location, Drawing, Text, Image} <-- this relates to a comment in app/routes/drawings

Location.hasMany(Drawing);
Location.hasMany(Text);
Location.hasMany(Image);
// Location.hasMany(User, {as: 'author'}); //I am not sure location and user make the most sense to associate directly. It might be slightly redundant, but if you have the use case -- KHGB

Drawing.belongsTo(Location);
Text.belongsTo(Location);
Image.belongsTo(Location);


Drawing.belongsTo(User);
Text.belongsTo(User);
Image.belongsTo(User);

User.hasMany(Drawing);
User.hasMany(Text);
User.hasMany(Image);
