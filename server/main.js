'use strict';
var chalk = require('chalk');
var db = require('./db');
var fs = require('fs');
var path = require('path')

// Create a node server instance! cOoL!

//Alternate suggestion to line 18 - 33 -- KHGB
// let options = process.env.NODE_ENV === 'production' ? {} : {
// 		key: fs.readFileSync(path.join( __dirname, '/env/https/server.key')),
// 	    cert: fs.readFileSync(path.join(__dirname, '/env/https/server.crt')),
// 	    requestCert: false,
// 	    rejectUnauthorized: false
// 	},
// 	server = require('http').createServer(options); 

var server;
var options;

if ( process.env.NODE_ENV === 'production'){
	server = require('http').createServer();
}

else {
	options = {
		key: fs.readFileSync(path.join( __dirname, '/env/https/server.key')),
	    cert: fs.readFileSync(path.join(__dirname, '/env/https/server.crt')),
	    requestCert: false,
	    rejectUnauthorized: false
	}
	server = require('https').createServer(options);
}

var createApplication = function () {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    require('./io')(server);   // Attach socket.io. //are you using sockets? Are you planning on using it? -- KHGB
};

var startServer = function () {

    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

db.sync()
.then(createApplication)
.then(startServer)
.catch(function (err) {
    console.error(chalk.red(err.stack));
});
