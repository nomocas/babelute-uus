# babelute-uus : Universal Unambiguous (DSL) Sentences proposal

Welcome in Sharing Era. 

Or where a so simple idea has so deep and broad implications.

UUS example :

`#mylexic foo bar("zoo", goo)`

## First, lets talk about Information Quality.

Which is the __quality__ of the information stored in our DBs ?
Which kind of data could be described ? (temporality, relations, nature, subject qualities, ...)
Which qualities could we seek for good data ? (expressive, complete, precise, universal, human readable, validable, short, queryable, serialisable, unambiguous, ...)
Which are existing concreet models of data ? SQL (tables and rows with joins), NoSQL (rughly Object-as-Document oriented), XMLDoc DBs family (trees and decorated nodes), Graph DB (graphs and nodes)... Human Language Texts... Web Ontologies...
Are they complete ?

Which is the effort needed to extract informations ?

The fact is that we could store optimaly much more precise informations in simple unambiguous DSL sentences than in any other data structure or human language text.

We should see it as a new Abstract Data Type (ADT).

The only way to conserve all the informations stored in a sentence is to write something equivalent to a Document.
A Document here means the structure that we found in XML documents tree, made of nodes with type, namespace, properties (attributes) and children.

So it's a particular tree with "decorated" nodes, with namespaces links that add a graph dimension.

I'm not saying that there is no other way : but if we want to store it in DB by example, we could simulate the sentence structure with NoSQL arrays and object descriptors, or sql joins (good luck!), but it will always be a simulation of an __equivalent__ XML Document.

But... I don't now you but I always found XML quite heavy, poorly readable, not fun to write, hard coupled with slugish parser, etc.
So I think that we could find better. (but keep the idea in mind.. we'll come back on it)

We could also store it directly as a graph with something like Neo4j.

First : Define a lightweight optimal serialised form of Babelute sentences.
(And provide the associated parser/stringifier for JS in Babelute.js of course).

## More

- Link with ontologies
- Inference Engine
- DSL repository
- Web exposition
- DSL-DB



## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2016-2017 (c) Gilles Coomans <gilles.coomans@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
