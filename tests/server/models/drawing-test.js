var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var  Drawing = db.model('drawing');

describe('Drawing model', () => {
    beforeEach('Sync DB', () => {
        return db.sync({ force: true });
    });
    decribe('Correctly saves drawings', function(){
        it('should exist', function(){

        })
    })
})
