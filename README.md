# babelute-uus : Universal Unambiguous (DSL) Sentences proposal

[![Travis branch](https://img.shields.io/travis/nomocas/babelute-uus/master.svg)](https://travis-ci.org/nomocas/babelute-uus)
[![bitHound Overall Score](https://www.bithound.io/github/nomocas/babelute-uus/badges/score.svg)](https://www.bithound.io/github/nomocas/babelute-uus)
[![Coverage Status](https://coveralls.io/repos/github/nomocas/babelute-uus/badge.svg?branch=master)](https://coveralls.io/github/nomocas/babelute-uus?branch=master)
[![bitHound Dependencies](https://www.bithound.io/github/nomocas/babelute-uus/badges/dependencies.svg)](https://www.bithound.io/github/nomocas/babelute-uus/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/nomocas/babelute-uus/badges/devDependencies.svg)](https://www.bithound.io/github/nomocas/babelute-uus/master/dependencies/npm)
[![npm-downloads](https://img.shields.io/npm/dm/babelute-uus.svg)]()
[![npm](https://img.shields.io/npm/v/babelute-uus.svg)]()
[![licence](https://img.shields.io/npm/l/babelute-uus.svg)]()

Babelute sentences (de)serialization.

Welcome in Sharing Era.

UUS examples : 
- `#my-lexic: foo() bar("zoo")`
- `#my-lexic: foo() bar("zoo", #my-other-lexicon: goo(true) lollipop([1, 2, 3]))`

or beautified :

```
#my-lexic:
foo()
bar("zoo", 
	#my-other-lexicon: 
	goo(true) 
	lollipop([1, 2, 3])
)
boo({ some:true })
```

Pure Functional Host-Language Agnostic Internal DSL Form. 

Much more expressive, clean and terse than JSON or XML (UUS could be seen as a super-set of both).

Ok, actual Host-Language Agnosticism will be achieved when there will be UUS parser in other Host Language than javascript.
Feel free to contribute... ;)

This implementation offer :
- Small, Clean, and Fast parser based on [elenpi](https://github.com/nomocas/elenpi) (an internal DSL for LL(1) parser generation).
- Ultra Fast serialisation (2 or 3 times faster than equivalent JSON output).

## Install

```
yarn add babelute babelute-uus
```

## Usage

```javascript
import babelute from 'babelute'; // or var babelute = require('babelute');
import 'babelute-uus';	// or require('babelute-uus');

const lexicon = babelute.createLexicon('my-lexic');

lexicon.addAtoms(['foo', 'goo', 'bar', 'lollipop']);

const h = lexicon.initializer();

const sentence = h.foo()
.bar("zoo", 
	h.goo(true) 
	.lollipop([1, 2, 3])
)
.boo({ some:true });

/*
 *** SERIALIZATION
 */

const string = sentence.$toUUS();
// #my-lexic:foo()bar("zoo",goo(true)lollipop([1,2,3]))

const string2 = sentence.$toUUS({ beautify:true });
/*
#my-lexic:
foo()
bar("zoo",
	goo(true)
	lollipop([1, 2, 3])
)
*/

/*
 *** DESERIALIZATION
 */

babelute.registerLexicon(lexicon); // to make it accessible globally to parser
const parsedSentence = babelute.fromUUS(string /* or string2 */);
// parsedSentence is the same as initial sentence
```



## Sentences as Optimal Structure Catcher

Babelute's sentences could be seen (structurally) as a super set of XML with better expressivity.
And is (much) more readable and less verbose.

Main XML differences :
- no attributes/children differenciation : everything is function or argument.
- and as you could provide babelute sentence(s) as any argument(s) of lexems : you could easily express more complex structuration than XML tags allow (because a tag could only have one list of children).
- namespaces are expressed in term of Lexicon
- it is softly typed and contains more primitives than JSON (bool, number (int and float), string, null, undefined, NaN, Infinity, object, array, function and of course sentences (seen as an ADT) themselves)


More on it soon. Mainly :
- Lexicon Scope Management (xml namespace equivalent)
- Atomic and FirstLevel Form
- UUS Form of Lexicon-Definition-Language
- Sentences validation

## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2017 (c) Gilles Coomans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
