'use strict';
const db = require('./_db');
const User = require('./models/user');
const Drawing = require('./models/drawing');
const Text = require('./models/text');
const Image = require('./models/image');
const Project = require('./models/project')

module.exports = db;

Project.hasOne(Drawing);
Project.hasMany(Text);
Project.hasMany(Image);

Drawing.belongsTo(Project);
Text.belongsTo(Project);
Image.belongsTo(Project);

User.hasMany(Project);
Project.belongsTo(User);

