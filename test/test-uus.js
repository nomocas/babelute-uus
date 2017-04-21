/* global describe, it */
import chai from 'chai';
import babelute from 'babelute';
import toUUS from '../src/to-uus';
import fromUUS from '../src/from-uus';

const expect = chai.expect;
chai.should();

describe('babelute UUS : argument value', () => {
	const lexicon = babelute.createLexicon('uus-test');
	lexicon.addAtoms(['goo']);
	babelute.registerLexicon(lexicon);
	it('should parse empty call', () => {
		const string = `#uus-test:goo()`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse empty call', () => {
		const string = `#uus-test:goo()`;
		toUUS(fromUUS(string, { beautify: true })).should.equal(string);
	});
	it('should parse null', () => {
		const string = `#uus-test:goo(null)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse true', () => {
		const string = `#uus-test:goo(true)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse false', () => {
		const string = `#uus-test:goo(false)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse NaN', () => {
		const string = `#uus-test:goo(NaN)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse Infinity', () => {
		const string = `#uus-test:goo(Infinity)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse undefined', () => {
		const string = `#uus-test:goo(undefined)`;
		toUUS(fromUUS(string)).should.equal(`#uus-test:goo()`);
	});
	it('should parse single string', () => {
		const string = `#uus-test:goo('foo')`;
		toUUS(fromUUS(string)).should.equal(`#uus-test:goo("foo")`);
	});
	it('should parse integer', () => {
		const string = `#uus-test:goo(12)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse float', () => {
		const string = `#uus-test:goo(12.02)`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse double string', () => {
		const string = `#uus-test:goo("foo")`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse object', () => {
		const string = `#uus-test:goo({test:true})`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse array', () => {
		const string = `#uus-test:goo([1,2,false])`;
		toUUS(fromUUS(string)).should.equal(string);
	});
	it('should parse function', () => {
		const string = `#uus-test:goo(function (arg1,arg2) { console.log('boh'); })`;
		toUUS(fromUUS(string)).should.equal(`#uus-test:goo(function (arg1,arg2) { console.log('boh');  })`);
	});
	it('should parse function and forget it with opt.acceptFunctions = false', () => {
		const string = `#uus-test:goo(function (arg1,arg2) { console.log('boh'); })`;
		toUUS(fromUUS(string, { acceptFunctions: false })).should.equal(`#uus-test:goo()`);
	});
	it('should parse function with inner scope', () => {
		const string = `#uus-test:goo(function (arg1,arg2) { if(true) { console.log('boh'); } })`;
		toUUS(fromUUS(string)).should.equal(`#uus-test:goo(function (arg1,arg2) { if(true) { console.log('boh'); }  })`);
	});
});


describe('Babelute UUS', () => {

	it('parsing atoms to lexicon.atomic (minified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
		babelute.registerLexicon(lexicon);

		const string = `#uus-test:goo(true,foo("wee\\"e'e")zoo(1,false)bar())`;

		toUUS(fromUUS(string)).should.equal(string);
	});

	it('parsing atoms to lexicon.atomic (beautified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
		babelute.registerLexicon(lexicon);

		const string = `#uus-test:goo( true, foo( zoo("hopla") ) zoo(1, foo("lollipop") bar("long word")) bar() )`;
		const string2 = `#uus-test:
goo(
	true,
	foo(zoo("hopla"))
	zoo(
		1,
		foo("lollipop")
		bar("long word")
	)
	bar()
)`;

		toUUS(fromUUS(string), { beautify: true }).should.equal(string2);
	});


	it('parsing function to lexicon.atomic (beautified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
		babelute.registerLexicon(lexicon);

		const string = `#uus-test:goo(function(arg){ console.log('boh'); })`;
		const string2 = `#uus-test:
goo(function (arg) {
 console.log('boh'); 
})`;

		toUUS(fromUUS(string), { beautify: true }).should.equal(string2);
	});



	it('changing lexicon (atomic minified)', () => {

		const lexicon = babelute.createLexicon('uus-test1');
		lexicon.addAtoms(['goo', 'zoo']);
		babelute.registerLexicon(lexicon);

		const lexicon2 = babelute.createLexicon('uus-test2');
		lexicon2.addAtoms(['foo', 'bar']);
		babelute.registerLexicon(lexicon2);

		const string = `#uus-test1:goo(true,#uus-test2:foo("bloup")bar())zoo(1,false)`;

		toUUS(fromUUS(string)).should.equal(string);
	});

	it('object arg (atomic minified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo']);
		babelute.registerLexicon(lexicon);

		const string = `#uus-test:goo({test:true})`;

		toUUS(fromUUS(string)).should.equal(string);
	});

	it('array arg (atomic minified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo']);
		babelute.registerLexicon(lexicon);

		const string = `#uus-test:goo([1,2,3])`;

		toUUS(fromUUS(string)).should.equal(string);
	});

	it('escaped string arg (atomic minified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo']);
		babelute.registerLexicon(lexicon);

		const string = `#uus-test:goo("wee\\"e'e")`;

		toUUS(fromUUS(string)).should.equal(string);
	});

	it('double lexicon set (atomic minified)', () => {

		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo']);
		babelute.registerLexicon(lexicon);
		const lexicon2 = babelute.createLexicon('uus-test2');
		lexicon2.addAtoms(['foo']);
		babelute.registerLexicon(lexicon2);

		const string = `#uus-test:goo(true)#uus-test2:foo(1)`;

		toUUS(fromUUS(string)).should.equal(string);
	});

});
describe('babelute UUS : will throw', () => {

	describe('when method not found', () => {
		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo']);
		babelute.registerLexicon(lexicon);
		const string = `#uus-test:foo()`;

		const willThrow = function() {
			fromUUS(string);
		};

		it('should throw', () => {
			expect(willThrow).to.throw();
		});
	});

	describe('when string badly terminated', () => {
		const lexicon = babelute.createLexicon('uus-test');
		lexicon.addAtoms(['goo']);
		babelute.registerLexicon(lexicon);
		const string = `#uus-test:goo({ test:`;

		const willThrow = function() {
			fromUUS(string);
		};

		it('should throw', () => {
			expect(willThrow).to.throw();
		});
	});
	it('parsing function to lexicon.atomic (beautified) with multiline template string', () => {
		const string = "#uus-test:goo(function (arg) { test(`boh\nloo` + arg); })";
		const string2 = `#uus-test:
goo(function (arg) {
 test(\`boh
loo\` + arg); 
})`;
		toUUS(fromUUS(string), { beautify: true }).should.equal(string2);
	});
});

