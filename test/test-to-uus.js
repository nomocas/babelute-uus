/* global describe, it */
import babelute from 'babelute';
import toUUS from '../src/to-uus';
import chai from 'chai';

chai.should();

describe('Babelute UUS : toUUS', () => {
	const lexicon = babelute.createLexicon('uus-test');
	lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
	const h = lexicon.initializer();

	it('should parse null', () => {
		const b = h.goo(null);
		toUUS(b).should.equal(`#uus-test:goo(null)`);
	});
	it('should parse true', () => {
		const b = h.goo(true);
		toUUS(b).should.equal(`#uus-test:goo(true)`);
	});
	it('should parse false', () => {
		const b = h.goo(false);
		toUUS(b).should.equal(`#uus-test:goo(false)`);
	});
	it('should parse undefined', () => {
		const b = h.goo(undefined);
		toUUS(b).should.equal(`#uus-test:goo()`);
	});
	it('should parse Infinity', () => {
		const b = h.goo(Infinity);
		toUUS(b).should.equal(`#uus-test:goo(Infinity)`);
	});
	it('should parse NaN', () => {
		const b = h.goo(NaN);
		toUUS(b).should.equal(`#uus-test:goo(NaN)`);
	});
	it('should parse Integer', () => {
		const b = h.goo(12);
		toUUS(b).should.equal(`#uus-test:goo(12)`);
	});
	it('should parse Float', () => {
		const b = h.goo(12.02);
		toUUS(b).should.equal(`#uus-test:goo(12.02)`);
	});
	it('should parse object', () => {
		const b = h.goo({ test: true });
		toUUS(b).should.equal(`#uus-test:goo({test:true})`);
	});
	it('should parse sub object', () => {
		const b = h.goo({ test: true, foo: false, bar: { goo: 123 } });
		toUUS(b).should.equal(`#uus-test:goo({test:true,foo:false,bar:{goo:123}})`);
	});
	it('should parse array', () => {
		const b = h.goo([1, 2]);
		toUUS(b).should.equal(`#uus-test:goo([1,2])`);
	});
	it('should parse structured sentences', () => {
		const b = h.goo(true, h.foo("wee\"e'e").zoo(1, false).bar());
		toUUS(b).should.equal(`#uus-test:goo(true,foo("wee\\"e'e")zoo(1,false)bar())`);
	});
	it('should parse empty array and beautify it', () => {
		const b = h.bar([]);
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test: bar([])`);
	});
	it('should parse array and beautify it with simple break', () => {
		const b = h.bar([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test:
bar([
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10
])`);
	});

	it('should parse array and beautify it multiline', () => {
		const b = h.bar([1234, 2234, 3234, 4234, 5234, 6234, 7233, 8233, 9233, 10233]);
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test:
bar([
	1234,
	2234,
	3234,
	4234,
	5234,
	6234,
	7233,
	8233,
	9233,
	10233
])`);
	});

	it('should parse empty array and beautify it', () => {
		const b = h.bar({});
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test: bar({  })`);
	});
	it('should parse array and beautify it with simple break', () => {
		const b = h.bar({ a: true, b: false, c: 'bar' });
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test:
bar({
	a: true, b: false, c: "bar"
})`);
	});

	it('should parse array and beautify it with complete break', () => {
		const b = h.bar({ abcdefghijkl: true, abcdefghijkl1: false, abcdefghijkl2: 'bar', abcdefghijkl3: 'bar' });
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test:
bar({
	abcdefghijkl: true,
	abcdefghijkl1: false,
	abcdefghijkl2: "bar",
	abcdefghijkl3: "bar"
})`);
	});


	it('should parse structured sentences and beautify it', () => {
		const b = h.goo(true, h.foo("wee\"e'e", [1, 2, 3]).zoo(1, []).bar().goo({ test: true, a: [] }).bar([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
		toUUS(b, { beautify: true }).should.equal(
			`#uus-test:
goo(
	true,
	foo(
		"wee\\"e'e", [1, 2, 3]
	)
	zoo(1, [])
	bar()
	goo({ test: true, a: [] })
	bar([
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10
	])
)`);

	});



});

