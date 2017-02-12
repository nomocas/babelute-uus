/* global describe, it */
import 'babel-plugin-external-helpers';
import chai from 'chai';
import babelute from 'babelute';
import toUUS from '../src/to-uus.js';
// Babelute DSL parser
import fromUUS from '../src/from-uus.js';

chai.should();

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

		toUUS(fromUUS(string), { beautify:true }).should.equal(string2);
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

});

