'use strict';
const db = require('./_db');
const User = require('./models/user');
const Location = require('./models/location');
const Drawing = require('./models/drawing');
const Text = require('./models/text');
const Image = require('./models/image');
const Project = require('./models/project')

module.exports = db;

Project.hasOne(User);
Project.hasOne(Location);
Project.hasOne(Drawing);
Project.hasMany(Text);
Project.hasMany(Image);

Location.belongsTo(Project);
Drawing.belongsTo(Project);
Text.belongsToMany(Project);
Image.belongsToMany(Project);

User.hasmany(Project);

// Location.hasMany(User, {as: 'author'});

// Drawing.belongsTo(Location);
// Text.belongsTo(Location);
// Image.belongsTo(Location);


// Drawing.belongsTo(User);
// Text.belongsTo(User);
// Image.belongsTo(User);

// User.hasMany(Drawing);
// User.hasMany(Text);
// User.hasMany(Image);
