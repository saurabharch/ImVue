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
let Stroke =  db.model('stroke');
let Text =  db.model('text')
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
// =======
// var faker = require('faker');
// var chalk = require('chalk');
// var db = require('./server/db');
// var User = db.model('user');
// var Location = db.model('location');
// var Drawing = db.model('drawing');
// var Promise = require('sequelize').Promise;
//
//
// var seedUsers = function () {
//
//     var users = [{
//         email: 'testing@fsa.com',
//         password: 'password'
//     }, {
//         email: 'obama@gmail.com',
//         password: 'potus'
//     }];
// >>>>>>> master

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
// =======
// var seedLocations = function () {
//
//     var locations = [ { latitude: 41.14828626695406,
//     longitude: -74.01261841512903,
//     altitude: 13.73810346862551 },
//   { latitude: 41.590018203071345,
//     longitude: -73.55275502901945,
//     altitude: 13.900286137714653 },
//   { latitude: 41.07712676310291,
//     longitude: -73.55357980892694,
//     altitude: 13.671993637658112 },
//   { latitude: 41.567115778332195,
//     longitude: -73.31733917459002,
//     altitude: 13.492898653927949 },
//   { latitude: 40.81538871543552,
//     longitude: -73.07783177569969,
//     altitude: 14.168296397344811 },
//   { latitude: 40.95376075666512,
//     longitude: -73.7555521251368,
//     altitude: 13.91044031912221 },
//   { latitude: 41.32390484009886,
//     longitude: -73.31923580336627,
//     altitude: 13.363107253031702 },
//   { latitude: 41.517319242228936,
//     longitude: -73.99750000321605,
//     altitude: 13.640591660857066 },
//   { latitude: 41.364867873738696,
//     longitude: -73.58208466636404,
//     altitude: 14.037239259785633 },
//   { latitude: 40.74543067224384,
//     longitude: -73.4219915305944,
//     altitude: 14.068685431593604 },
//   { latitude: 41.01369354792627,
//     longitude: -73.74484628345277,
//     altitude: 14.052175547754324 },
//   { latitude: 40.77037886973754,
//     longitude: -73.5705108037419,
//     altitude: 13.781635571722292 },
//   { latitude: 41.3484869368964,
//     longitude: -73.34470364455161,
//     altitude: 14.052663880895757 },
//   { latitude: 40.91825339451182,
//     longitude: -73.06288977968937,
//     altitude: 14.277323629339861 },
//   { latitude: 40.73407637760158,
//     longitude: -73.28873084849606,
//     altitude: 13.93764699363329 },
//   { latitude: 40.79666644442783,
//     longitude: -73.4720519005485,
//     altitude: 13.42162666762039 },
//   { latitude: 41.385633775510364,
//     longitude: -73.44787314257944,
//     altitude: 13.932861712426305 },
//   { latitude: 41.096432728587224,
//     longitude: -73.9702364789044,
//     altitude: 13.711570467295399 },
//   { latitude: 41.13280834444486,
//     longitude: -73.81752828043957,
//     altitude: 13.581184618622446 },
//   { latitude: 41.00307907612139,
//     longitude: -73.12717134335276,
//     altitude: 14.13268157286148 },
//   { latitude: 40.77058303969705,
//     longitude: -73.94562004134579,
//     altitude: 13.860570035510836 },
//   { latitude: 40.931075611546355,
//     longitude: -73.59905534342785,
//     altitude: 13.402643843277938 },
//   { latitude: 41.12432148251267,
//     longitude: -73.04446514611699,
//     altitude: 13.595840069137177 },
//   { latitude: 41.670255044780355,
//     longitude: -73.77455026844352,
//     altitude: 13.54913431725733 },
//   { latitude: 41.193095735746574,
//     longitude: -73.68376437595103,
//     altitude: 14.063524889734918 },
//   { latitude: 40.71508841158598,
//     longitude: -73.41651732453268,
//     altitude: 13.982187049800014 },
//   { latitude: 41.29407053332067,
//     longitude: -73.78630708365594,
//     altitude: 13.716097980366591 },
//   { latitude: 41.25704745123758,
//     longitude: -73.06541945740513,
//     altitude: 13.960112956907887 },
//   { latitude: 40.715814862429916,
//     longitude: -73.64210846910733,
//     altitude: 14.047788840862157 },
//   { latitude: 41.02458220677781,
//     longitude: -73.112176665825,
//     altitude: 13.721359645936033 },
//   { latitude: 41.43254138937945,
//     longitude: -73.11887263015981,
//     altitude: 13.410800888756627 },
//   { latitude: 41.11183817886382,
//     longitude: -73.58688987560716,
//     altitude: 13.777130593837194 },
//   { latitude: 40.99937680103716,
//     longitude: -73.2943127899668,
//     altitude: 13.957678704701927 },
//   { latitude: 40.95719614915297,
//     longitude: -73.8152621787582,
//     altitude: 13.82997762429768 },
//   { latitude: 41.574495704850854,
//     longitude: -74.0193204466362,
//     altitude: 13.794022927448685 },
//   { latitude: 41.06570006271204,
//     longitude: -73.30574939901076,
//     altitude: 14.296898405101256 },
//   { latitude: 41.26158471525709,
//     longitude: -73.33336871943999,
//     altitude: 13.980501774955599 },
//   { latitude: 41.623836950235464,
//     longitude: -73.68549300531747,
//     altitude: 13.942290741737084 },
//   { latitude: 41.17553472772834,
//     longitude: -73.95905583778216,
//     altitude: 13.464902470100153 },
//   { latitude: 41.64545840430775,
//     longitude: -74.018287596973,
//     altitude: 13.755305780361073 },
//   { latitude: 40.99791613881166,
//     longitude: -73.78989679172047,
//     altitude: 14.222813212417064 },
//   { latitude: 40.977060752534086,
//     longitude: -73.11656585334654,
//     altitude: 13.359764059466787 },
//   { latitude: 41.64931417798116,
//     longitude: -73.43123302418766,
//     altitude: 13.833003095359473 },
//   { latitude: 41.40207650017136,
//     longitude: -73.59224438516466,
//     altitude: 13.700089912486307 },
//   { latitude: 41.633778211778804,
//     longitude: -73.95726712703242,
//     altitude: 13.694443137765195 },
//   { latitude: 40.8328817043395,
//     longitude: -73.2391275496106,
//     altitude: 14.057310674901055 },
//   { latitude: 41.266213392621694,
//     longitude: -73.05096185762605,
//     altitude: 13.494524327047882 },
//   { latitude: 41.68438324812579,
//     longitude: -73.76146193963774,
//     altitude: 14.221630705249948 },
//   { latitude: 41.17568242637917,
//     longitude: -73.58054045600906,
//     altitude: 13.690279610442373 },
//   { latitude: 40.87469437280511,
//     longitude: -73.70310122603506,
//     altitude: 13.342815083916296 } ];
//
//     // var creatingLocations = locations.map(function (locationObj) {
//     //     return Location.create(locationObj);
//     // });
//     var creatingLocations = locations.map(l => Location.create(l));
//     return Promise.all(creatingLocations);
// }
//
// var seedDrawings = function() {
//     var drawings = [];
//     for(var i = 0; i < 200; i++) {
//         var strokes = faker.image.food();
//         drawings.push({strokes: strokes});
//     }
//
//     var creatingDrawings = drawings.map(d => Drawing.create(d));
//     return Promise.all(creatingDrawings);
// }
//
//
// db.sync({
//         force: true
//     })
//     .then(function () {
//         return seedUsers();
//     })
//     .then(function () {
//         return seedLocations();
//     })
//     .then(function() {
//         return seedDrawings();
//     })
//     .then(function () {
// >>>>>>> master
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });







/*

var loc = {latitude: 40.7135446, longitude: -74.032442, altitude: 13.31};
var locations = [];
for(var i=0; i<50; i++) {
	var newLoc = {};
	newLoc.latitude = loc.latitude + (Math.random() * 1000000)/1000000;
	newLoc.longitude = loc.longitude + (Math.random() * 1000000)/1000000;
	newLoc.altitude = loc.altitude + (Math.random() * 1000000)/1000000;
	locations.push(newLoc);
}

*/
