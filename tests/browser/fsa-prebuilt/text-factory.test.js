describe('TextFactory', function () {

    beforeEach(module('FullstackGeneratedApp'));

    var TextFactory

    beforeEach('Get factories', inject(function (_TextFactory_) {
        TextFactory = _TextFactory_;
    })); 

    it('should be an object', () => {
        expect(TextFactory).to.be.an('object');
    });

    it('should initialize textSelect to false', () => {
    	expect(TextFactory.showTextSelect()).to.be.equal(false);
    }) 


})