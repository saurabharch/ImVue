const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const db = require('./server/db');
const User = db.model('user');
const Drawing = db.model('drawing');
const Text = db.model('text');
const Image = db.model('image');
const Location = db.model('location');
const Promise = require('sequelize').Promise;

/* seed data */
const users = [
  {userName: 'Jose', email: 'testing@fsa.com', password: 'password'},
  {userName: 'President', email: 'obama@gmail.com', password: 'potus'},
  {userName: 'Han', email: 'han@gmail.com', password: 'han1234'},
  {userName: 'John Doe', email: 'john@gmail.com', password: 'doe'},
  {userName: 'Jane Doe', email: 'jane@gmail.com', password: 'doe'}
];


const texts = [
  {font: 'serif', size: 32, color: 'black', x: 843, y: 357, content: 'Hello World'},
  {font: 'Arial', size: 40, color: 'black', x: 478, y: 290, content: 'Awesome'},
  {font: 'Verdana', size: 144, color: 'black', x: 816, y: 765, content: 'Awesome'},
  {font: 'serif', size: 110, color: 'white', x: 383, y: 111, content: 'Awesome'},
  {font: 'Times New Roman', size: 73, color: 'black', x: 112, y: 463, content: 'Hello World'},
  {font: 'Times New Roman', size: 79, color: 'purple', x: 583, y: 580, content: 'Awesome'},
  {font: 'Times New Roman', size: 102, color: 'black', x: 118, y: 519, content: 'Splendid'},
  {font: 'Courier New', size: 67, color: 'yellow', x: 984, y: 265, content: 'Amazing!'},
  {font: 'Arial', size: 133, color: 'green', x: 301, y: 984, content: 'Awesome'},
  {font: 'Times New Roman', size: 70, color: 'yellow', x: 482, y: 708, content: 'Hello World'},
  {font: 'serif', size: 40, color: 'white', x: 641, y: 588, content: 'Amazing!'},
  {font: 'Times New Roman', size: 76, color: 'white', x: 950, y: 944, content: 'Splendid'},
  {font: 'sans-serif', size: 107, color: 'white', x: 238, y: 628, content: 'Amazing!'},
  {font: 'Times New Roman', size: 33, color: 'purple', x: 139, y: 5, content: 'Splendid'},
  {font: 'sans-serif', size: 77, color: 'green', x: 874, y: 150, content: 'Amazing!'},
  {font: 'serif', size: 31, color: 'green', x: 26, y: 122, content: 'Awesome'},
  {font: 'Times New Roman', size: 10, color: 'white', x: 266, y: 48, content: 'Amazing!'},
  {font: 'Courier New', size: 45, color: 'white', x: 458, y: 506, content: 'Amazing!'},
  {font: 'sans-serif', size: 111, color: 'green', x: 120, y: 71, content: 'Awesome'},
  {font: 'Arial', size: 55, color: 'white', x: 729, y: 126, content: 'Splendid'},
  {font: 'sans-serif', size: 42, color: 'white', x: 276, y: 347, content: 'Splendid'},
  {font: 'Arial', size: 77, color: 'blue', x: 348, y: 887, content: 'Awesome'},
  {font: 'Times New Roman', size: 80, color: 'black', x: 395, y: 497, content: 'Splendid'},
  {font: 'Courier New', size: 126, color: 'blue', x: 422, y: 483, content: 'Amazing!'},
  {font: 'sans-serif', size: 91, color: 'black', x: 628, y: 79, content: 'Amazing!'},
  {font: 'Verdana', size: 1, color: 'red', x: 517, y: 863, content: 'Awesome'},
  {font: 'Arial', size: 146, color: 'blue', x: 80, y: 418, content: 'Amazing!'},
  {font: 'sans-serif', size: 14, color: 'black', x: 933, y: 272, content: 'Awesome'},
  {font: 'Times New Roman', size: 46, color: 'green', x: 517, y: 600, content: 'Amazing!'},
  {font: 'Courier New', size: 26, color: 'green', x: 227, y: 964, content: 'What up'},
  {font: 'Courier New', size: 16, color: 'blue', x: 25, y: 411, content: 'Awesome'},
  {font: 'sans-serif', size: 23, color: 'black', x: 185, y: 163, content: 'What up'},
  {font: 'Courier New', size: 130, color: 'black', x: 867, y: 701, content: 'Hello World'},
  {font: 'Times New Roman', size: 67, color: 'purple', x: 622, y: 891, content: 'What up'},
  {font: 'Times New Roman', size: 52, color: 'purple', x: 261, y: 893, content: 'Awesome'},
  {font: 'Verdana', size: 34, color: 'yellow', x: 439, y: 5, content: 'What up'},
  {font: 'Verdana', size: 93, color: 'black', x: 554, y: 298, content: 'What up'},
  {font: 'Verdana', size: 141, color: 'purple', x: 897, y: 797, content: 'Hello World'},
  {font: 'Times New Roman', size: 132, color: 'red', x: 805, y: 960, content: 'Hello World'},
  {font: 'sans-serif', size: 97, color: 'blue', x: 147, y: 395, content: 'What up'},
  {font: 'Verdana', size: 1, color: 'blue', x: 545, y: 312, content: 'What up'},
  {font: 'sans-serif', size: 5, color: 'purple', x: 219, y: 847, content: 'Awesome'},
  {font: 'Verdana', size: 86, color: 'yellow', x: 712, y: 550, content: 'Splendid'},
  {font: 'sans-serif', size: 23, color: 'red', x: 62, y: 654, content: 'What up'},
  {font: 'sans-serif', size: 30, color: 'yellow', x: 121, y: 556, content: 'Hello World'},
  {font: 'Arial', size: 9, color: 'purple', x: 515, y: 467, content: 'Splendid'},
  {font: 'Arial', size: 49, color: 'black', x: 936, y: 116, content: 'What up'},
  {font: 'Courier New', size: 32, color: 'black', x: 217, y: 350, content: 'Hello World'},
  {font: 'Arial', size: 130, color: 'blue', x: 997, y: 22, content: 'Splendid'},
  {font: 'serif', size: 23, color: 'green', x: 20, y: 215, content: 'Hello World'}
];

const drawings = [
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,orange,800,600,800,1000,orange,800,1000,300,1000,orange,300,1000,300,600,orange' },
  {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
  {image: '300,600,800,600,green,800,600,800,1000,green,800,1000,300,1000,green,300,1000,300,600,green' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,orange,800,600,800,1000,orange,800,1000,300,1000,orange,300,1000,300,600,orange' },
  {image: '300,600,800,600,green,800,600,800,1000,green,800,1000,300,1000,green,300,1000,300,600,green' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,red,800,600,800,1000,red,800,1000,300,1000,red,300,1000,300,600,red' },
  {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
  {image: '300,600,800,600,brown,800,600,800,1000,brown,800,1000,300,1000,brown,300,1000,300,600,brown' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,undefined,800,600,800,1000,undefined,800,1000,300,1000,undefined,300,1000,300,600,undefined' },
  {image: '300,600,800,600,purple,800,600,800,1000,purple,800,1000,300,1000,purple,300,1000,300,600,purple' },
  {image: '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue' },
  {image: '300,600,800,600,yellow,800,600,800,1000,yellow,800,1000,300,1000,yellow,300,1000,300,600,yellow' }
];

const images = [
  {source: 'http://lorempixel.com/308/344/animals/', x: 126, y: 40},
  {source: 'http://lorempixel.com/456/294/animals/', x: 153, y: 143},
  {source: 'http://lorempixel.com/458/436/animals/', x: 119, y: 200},
  {source: 'http://lorempixel.com/350/459/animals/', x: 91, y: 152},
  {source: 'http://lorempixel.com/375/295/animals/', x: 11, y: 46},
  {source: 'http://lorempixel.com/392/255/animals/', x: 122, y: 224},
  {source: 'http://lorempixel.com/267/286/animals/', x: 108, y: 27},
  {source: 'http://lorempixel.com/306/407/animals/', x: 184, y: 16},
  {source: 'http://lorempixel.com/332/417/animals/', x: 122, y: 116},
  {source: 'http://lorempixel.com/388/233/animals/', x: 4, y: 74},
  {source: 'http://lorempixel.com/311/254/animals/', x: 13, y: 183},
  {source: 'http://lorempixel.com/165/462/animals/', x: 98, y: 214},
  {source: 'http://lorempixel.com/309/151/animals/', x: 127, y: 20},
  {source: 'http://lorempixel.com/393/419/animals/', x: 194, y: 54},
  {source: 'http://lorempixel.com/296/287/animals/', x: 76, y: 68},
  {source: 'http://lorempixel.com/172/212/animals/', x: 143, y: 149},
  {source: 'http://lorempixel.com/17/407/animals/', x: 232, y: 25},
  {source: 'http://lorempixel.com/64/205/animals/', x: 66, y: 191},
  {source: 'http://lorempixel.com/358/241/animals/', x: 133, y: 169},
  {source: 'http://lorempixel.com/205/191/animals/', x: 165, y: 116},
  {source: 'http://lorempixel.com/315/274/animals/', x: 171, y: 92},
  {source: 'http://lorempixel.com/217/212/animals/', x: 206, y: 208},
  {source: 'http://lorempixel.com/339/300/animals/', x: 69, y: 48},
  {source: 'http://lorempixel.com/236/456/animals/', x: 116, y: 190},
  {source: 'http://lorempixel.com/294/137/animals/', x: 97, y: 38},
  {source: 'http://lorempixel.com/198/2/animals/', x: 65, y: 122},
  {source: 'http://lorempixel.com/136/270/animals/', x: 0, y: 203},
  {source: 'http://lorempixel.com/309/119/animals/', x: 80, y: 235},
  {source: 'http://lorempixel.com/4/281/animals/', x: 10, y: 195},
  {source: 'http://lorempixel.com/335/252/animals/', x: 149, y: 113},
  {source: 'http://lorempixel.com/81/27/animals/', x: 63, y: 159},
  {source: 'http://lorempixel.com/295/223/animals/', x: 150, y: 74},
  {source: 'http://lorempixel.com/185/201/animals/', x: 230, y: 84},
  {source: 'http://lorempixel.com/226/56/animals/', x: 157, y: 204},
  {source: 'http://lorempixel.com/394/197/animals/', x: 94, y: 80},
  {source: 'http://lorempixel.com/121/458/animals/', x: 125, y: 238},
  {source: 'http://lorempixel.com/242/412/animals/', x: 178, y: 247},
  {source: 'http://lorempixel.com/318/459/animals/', x: 183, y: 0},
  {source: 'http://lorempixel.com/147/52/animals/', x: 80, y: 102},
  {source: 'http://lorempixel.com/244/480/animals/', x: 40, y: 104},
  {source: 'http://lorempixel.com/120/484/animals/', x: 227, y: 235},
  {source: 'http://lorempixel.com/52/482/animals/', x: 214, y: 9},
  {source: 'http://lorempixel.com/196/479/animals/', x: 120, y: 6},
  {source: 'http://lorempixel.com/13/345/animals/', x: 216, y: 48},
  {source: 'http://lorempixel.com/203/382/animals/', x: 166, y: 89},
  {source: 'http://lorempixel.com/330/2/animals/', x: 112, y: 135},
  {source: 'http://lorempixel.com/50/304/animals/', x: 57, y: 217},
  {source: 'http://lorempixel.com/9/320/animals/', x: 165, y: 87},
  {source: 'http://lorempixel.com/141/133/animals/', x: 217, y: 59},
  {source: 'http://lorempixel.com/396/348/animals/', x: 6, y: 26}
];

var locations = [
  {latitude: 40.705778, longitude: -74.008235, angle: 179, tilt: 78},
  {latitude: 40.705665, longitude: -74.008604, angle: 217, tilt: -9},
  {latitude: 40.705805, longitude: -74.008770, angle: 21, tilt: -25},
  {latitude: 40.706036, longitude: -74.009080, angle: 308, tilt: -51},
  {latitude: 40.705756, longitude: -74.008728, angle: 292, tilt: -40},
  {latitude: 40.705718, longitude: -74.008650, angle: 242, tilt: -117},
  {latitude: 40.705429, longitude: -74.009084, angle: 260, tilt: 42},
  {latitude: 40.705395, longitude: -74.009072, angle: 64, tilt: 149},
  {latitude: 40.705884, longitude: -74.008519, angle: 255, tilt: -166},
  {latitude: 40.705711, longitude: -74.008538, angle: 280, tilt: 17},
  {latitude: 40.706062, longitude: -74.008449, angle: 5, tilt: -178},
  {latitude: 40.705344, longitude: -74.009014, angle: 359, tilt: -144},
  {latitude: 40.705596, longitude: -74.008744, angle: 178, tilt: 100},
  {latitude: 40.706298, longitude: -74.008297, angle: 300, tilt: -37},
  {latitude: 40.705599, longitude: -74.009022, angle: 66, tilt: -37},
  {latitude: 40.706123, longitude: -74.008723, angle: 65, tilt: -101},
  {latitude: 40.705890, longitude: -74.009043, angle: 290, tilt: -115},
  {latitude: 40.705855, longitude: -74.008260, angle: 195, tilt: -87},
  {latitude: 40.706217, longitude: -74.008950, angle: 131, tilt: 103},
  {latitude: 40.705799, longitude: -74.008886, angle: 302, tilt: -81},
  {latitude: 40.705634, longitude: -74.008624, angle: 126, tilt: 19},
  {latitude: 40.705340, longitude: -74.008182, angle: 335, tilt: -142},
  {latitude: 40.706239, longitude: -74.008510, angle: 75, tilt: -10},
  {latitude: 40.705340, longitude: -74.008454, angle: 152, tilt: -110},
  {latitude: 40.706032, longitude: -74.008635, angle: 149, tilt: 15},
  {latitude: 40.705843, longitude: -74.008258, angle: 211, tilt: 6},
  {latitude: 40.705324, longitude: -74.008692, angle: 84, tilt: -64},
  {latitude: 40.706298, longitude: -74.008518, angle: 68, tilt: 113},
  {latitude: 40.705906, longitude: -74.008918, angle: 99, tilt: 143},
  {latitude: 40.705556, longitude: -74.008763, angle: 46, tilt: 16},
  {latitude: 40.705731, longitude: -74.008972, angle: 109, tilt: 10},
  {latitude: 40.705988, longitude: -74.009051, angle: 231, tilt: 146},
  {latitude: 40.705683, longitude: -74.008656, angle: 243, tilt: 2},
  {latitude: 40.705513, longitude: -74.008905, angle: 74, tilt: 31},
  {latitude: 40.706040, longitude: -74.008244, angle: 120, tilt: -113},
  {latitude: 40.705462, longitude: -74.008839, angle: 49, tilt: 112},
  {latitude: 40.706181, longitude: -74.008680, angle: 138, tilt: -89},
  {latitude: 40.705983, longitude: -74.009108, angle: 156, tilt: -136},
  {latitude: 40.705537, longitude: -74.009106, angle: 141, tilt: -45},
  {latitude: 40.705505, longitude: -74.008833, angle: 212, tilt: -166},
  {latitude: 40.705930, longitude: -74.008810, angle: 31, tilt: 6},
  {latitude: 40.706123, longitude: -74.009030, angle: 162, tilt: -112},
  {latitude: 40.705894, longitude: -74.009080, angle: 18, tilt: -11},
  {latitude: 40.706289, longitude: -74.008458, angle: 245, tilt: 44},
  {latitude: 40.705316, longitude: -74.008908, angle: 186, tilt: -180},
  {latitude: 40.705556, longitude: -74.009127, angle: 311, tilt: 45},
  {latitude: 40.706179, longitude: -74.008433, angle: 323, tilt: 118},
  {latitude: 40.706177, longitude: -74.009148, angle: 14, tilt: -72},
  {latitude: 40.706003, longitude: -74.008209, angle: 176, tilt: 75},
  {latitude: 40.705657, longitude: -74.008176, angle: 176, tilt: -78}
];



let seedUsers = () => {
  let creatingUsers = users.map(user => User.create(user));
  return Promise.all(creatingUsers);
};

let seedLocations = () => {
  let creatingLocations = locations.map(location => Location.create(location));
  return Promise.all(creatingLocations);
};

let seedTexts = () => {
  // let creatingTexts = texts.map(text => Text.create(text));
  let creatingTexts = texts.map(function(text){
    return Text.create(text)
      .then(function(createdText) {
        return createdText.setLocation(Math.floor(Math.random() * 50 + 1))
      })
      .then(function(txt) {
        return User.findById(Math.floor(Math.random() * users.length + 1))
          .then(user => txt.setUser(user))
      })
      // .then(assignedText => assignedText.save())
  })
  return Promise.all(creatingTexts);
};

let seedDrawings = () => {
  // let creatingDrawings = drawings.map(drawing => Drawing.create(drawing));
  let creatingDrawings = drawings.map(function(drawing){
    return Drawing.create(drawing)
      .then(function(createdDrawing) {
        return createdDrawing.setLocation(Math.floor(Math.random() * 50 + 1))
      })
      .then(function(drw) {
        return User.findById(Math.floor(Math.random() * users.length + 1))
          .then(user => drw.setUser(user))
      })
      // .then(assignedDrawing => assignedDrawing.save())
  })
  return Promise.all(creatingDrawings);
};

let seedImages = () => {
  // let creatingImages = images.map(image => Image.create(image));
  let creatingImages = images.map(function(image) {
    return Image.create(image)
      .then(function(createdImage) {
        return createdImage.setLocation(Math.floor(Math.random() * 50 + 1))
      })
      .then(function(img) {
        return User.findById(Math.floor(Math.random() * users.length + 1))
          .then(user => img.setUser(user))
      })
      // .then(assignedImage => assignedImage.save())
  })
  return Promise.all(creatingImages);
};




db.sync({ force: true })
  .then(() => {
    return seedUsers();
  })
  .then(() => {
      return seedLocations();
  })
  .then(() => {
    return seedTexts();
  })
  .then(() => {
      return seedDrawings();
  })
  .then(() => {
      return seedImages();
  })
  .then(() => {
      console.log(chalk.green('Seed successful!'));
      process.exit(0);
  })
  .catch((err) => {
      console.error(err);
      process.exit(1);
  });

