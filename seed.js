/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/
// <<<<<<< HEAD

let chalk = require('chalk');
let path = require('path');
let fs = require('fs');
let imgGen = require('js-image-generator')
let _ = require('lodash');
let db = require('./server/db');
let User = db.model('user')
let Drawing = db.model('drawing');
let Location = db.model('location');
let Promise = require('sequelize').Promise;

 var drawingPath =  path.join(__dirname, '/server/db/models/drawings/')

let getRandomInt = (min,max) => {
    return _.random(min,max)
}

let randomTrueFalse = () => {
    return !!_.random(0,1)
}

let getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[_.floor(_.random(16))];
    }
    console.log(color);
    return color;
}

getRandomColor();


let randomDotGrid = () => {
    let grid = new Array(200).fill(new Array(200).fill(randomTrueFalse()))

    console.log(grid);
    // grid.map()
    // if(randomTrueFalse){
    //
    // }
    //
    // return
}




// console.log(randomDotGrid());



let seedUsers = function () {

    let users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    let creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

// <<<<<<< HEAD
 console.log(__dirname);

let seedDrawings = () => {

    let imageCollection = []

    for(let imageNumber = 0; imageNumber < 20; imageNumber++ ){

        imgGen.generateImage(800, 600, 80, function(err, image){

            fs.writeFileSync(path.join(drawingPath)+'dummy'+imageNumber+'.jpg', image.data);
            imageCollection[imageNumber] = {directoryPath:path.join(drawingPath, 'dummy'+imageNumber+'.jpg')}
        })
    }

    let creatingDrawings =  imageCollection.map((drawingObj) => {
        return Drawing.create(drawingObj);
    })

    return Promise.all(creatingDrawings)

}

let seedLocations = () => {

    let locationCollection = [
        {latitude:40.7046076, longitude:-74.0070599, heading:72.4895858 },
        {latitude:40.7049060, longitude:-74.0086208, heading:76.1237869 },
        {latitude:40.7049060, longitude:-74.0086208, heading:75.5955726 },
        {latitude:40.7049060, longitude:-74.0086208, heading:78.7304382 },
        {latitude:40.7039400, longitude:-74.0088153, heading:63.4991913 },
        {latitude:40.7051723, longitude:-74.0102275, heading:86.4794692 },
        {latitude:40.7051723, longitude:-74.0102275, heading:9.76774311 },
        {latitude:40.7059424, longitude:-74.0094590, heading:66.7423629 },
        {latitude:40.7051723, longitude:-74.0102275, heading:3.51462483 },
        {latitude:40.7055303, longitude:-74.0092824, heading:95.2623138 },
    ]


    let creatingLocations =  locationCollection.map((locationObj) => {
        return Location.create(locationObj);
    })

    return Promise.all(creatingLocations)

}

db.sync({ force: true })
    .then(() => {
        return seedUsers();
    })
    .then(() => {
        return seedDrawings();
    })
    .then(() => {
        return seedLocations();
    })
    .then(() => {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

