/*
 * @Author: gilles
 * @Date:   2017-02-08 22:34:50
 * @Last Modified by:   gilles
 * @Last Modified time: 2017-02-08 22:42:56
 */

const babelute = require('babelute');
const uus = require('./dist/bundles/index'); 


const Lexicon = babelute.Lexicon;


const lexicon = new Lexicon('uus-test');
lexicon.addAtoms(['goo', 'zoo', 'foo', 'bar']);
Lexicon.register(lexicon);

const string = `#uus-test:goo(true,foo("wee\\"e'e")zoo(1,false)bar())`;

const b = uus.parse(string, {
	acceptFunctions: true
});


console.log(uus.stringify(b));