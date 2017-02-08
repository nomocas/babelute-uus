/* global describe, it */
import babelute from 'babelute';
import chai from 'chai';
import { parse, stringify } from '../src/index';

const Lexicon = babelute.Lexicon;
// const expect = chai.expect;

chai.should();

describe('Babelute UUS', () => {


	it('parsing atoms to lexicon.atomic (minified)', () => {

		const lexicon = new Lexicon('uus-test');
		lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
		Lexicon.register(lexicon);

		const string = `#uus-test:goo(true,foo("wee\\"e'e")zoo(1,false)bar())`;

		stringify(parse(string)).should.equal(string);
	});



	it('parsing atoms to lexicon.atomic (beautified)', () => {

		const lexicon = new Lexicon('uus-test');
		lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
		Lexicon.register(lexicon);

		const string = `#uus-test:goo( true, foo( zoo("hopla") ) zoo(1, foo("lollipop") bar("long word")) bar() )`;
		const string2 = 
`#uus-test:
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

		stringify(parse(string), { beautify:true }).should.equal(string2);
	});


	it('changing lexicon (atomic minified)', () => {

		const lexicon = new Lexicon('uus-test1');
		lexicon.addAtoms(['goo', 'zoo']);
		Lexicon.register(lexicon);

		const lexicon2 = new Lexicon('uus-test2');
		lexicon2.addAtoms(['foo', 'bar']);
		Lexicon.register(lexicon2);

		const string = `#uus-test1:goo(true,#uus-test2:foo("bloup")bar())zoo(1,false)`;

		stringify(parse(string)).should.equal(string);
	});

	it('object arg (atomic minified)', () => {

		const lexicon = new Lexicon('uus-test');
		lexicon.addAtoms(['goo']);
		Lexicon.register(lexicon);

		const string = `#uus-test:goo({test:true})`;

		stringify(parse(string)).should.equal(string);
	});
	it('array arg (atomic minified)', () => {

		const lexicon = new Lexicon('uus-test');
		lexicon.addAtoms(['goo']);
		Lexicon.register(lexicon);

		const string = `#uus-test:goo([1,2,3])`;

		stringify(parse(string)).should.equal(string);
	});



	it('escaped string arg (atomic minified)', () => {

		const lexicon = new Lexicon('uus-test');
		lexicon.addAtoms(['goo']);
		Lexicon.register(lexicon);

		const string = `#uus-test:goo("wee\\"e'e")`;

		stringify(parse(string)).should.equal(string);
	});

});

