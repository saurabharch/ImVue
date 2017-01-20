'use strict';
var chalk = require('chalk');
var db = require('./db');
var fs = require('fs');
var path = require('path')
var http = require('http')

// Create a node server instance! cOoL!
var server;
var options;

if (process.env.NODE_ENV === 'production') {
    server = require('http').createServer();
} else {
    options = {
        key: fs.readFileSync(path.join(__dirname, '/env/https/server.key')),
        cert: fs.readFileSync(path.join(__dirname, '/env/https/server.crt')),
        requestCert: false,
        rejectUnauthorized: false
    }
    server = require('https').createServer(options);
}

var createApplication = function() {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    require('./io')(server); // Attach socket.io.
};

var startServer = function() {

    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function() {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

db.sync()
    .then(createApplication)
    .then(startServer)
    .catch(function(err) {
        console.error(chalk.red(err.stack));
    });

setInterval(function() {
    console.log('Stay away awake')
    http.get("https://radiant-cliffs-28831.herokuapp.com");
}, 300000); // every 5 minutes (300000)
