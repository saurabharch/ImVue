var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var  Drawing = db.model('drawing');

describe('Drawing model', () => {
    beforeEach('Sync DB', () => {
        return db.sync({ force:true})
    });

    it('should exist', function(){
      expect(Drawing).to.be.a('object');
    })


    describe('Correctly saves 1 drawing', function(){

        let drawing;
        beforeEach(function(){
            return Drawing.create({
                image : '300,600,800,600,blue,800,600,800,1000,blue,800,1000,300,1000,blue,300,1000,300,600,blue'
            }).then(()=>{


            })
                .catch();
        })

        it('should be length of 1 ', function(){

            let foundDrawings ={};

            return Drawing.findAll({})
                .then(drawings => {

                    expect(drawings.length).to.equal(1)
                }).catch()

        })

        it("image property should be a string", function(){
            return Drawing.findById(1)
                .then(drawing => {
                    expect(drawing.image).be.a('string')
                }).catch()
        });

    });
});
