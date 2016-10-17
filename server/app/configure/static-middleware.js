'use strict';
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function(app) {

    var root = app.getValue('projectRoot');

    var npmPath = path.join(root, './node_modules');
    var publicPath = path.join(root, './public');
    var browserPath = path.join(root, './browser');
    var drawingPath = path.join(root, './server/db/models/drawings')

    app.use(express.static(drawingPath));

    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(npmPath));
    app.use(express.static(publicPath));
    app.use(express.static(browserPath));

};
