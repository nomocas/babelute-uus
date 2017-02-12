/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */

import elenpi from 'elenpi';
import babelute from 'babelute';

const Parser = elenpi.Parser,
	r = elenpi.r,
	b = babelute.init,
	replaceSingleString = /\\'/g,
	replaceDoubleString = /\\"/g,
	// grammar shortcut map (1 char previsu) for values
	valuePrevisuMap = {
		1: 'number',
		2: 'number',
		3: 'number',
		4: 'number',
		5: 'number',
		6: 'number',
		7: 'number',
		8: 'number',
		9: 'number',
		0: 'number',
		"'": 'singlestring',
		'"': 'doublestring',
		'{': 'object',
		'[': 'array'
	},
	rules = {
		//_____________________________________
		babelute: r
			.space()
			.oneOrMore({
				rule: 'lexem',
				separator: r.terminal(/^\s*/),
				pushTo(env, parent, obj) {
					// Parser.counts.countLexem++;
					if (obj.lexicon && obj.lexicon !== env.currentLexicon) { // 'scoped' lexicon management
						if (parent.__swapped__) // we have already push something before (aka second (or more) lexicon change on same babelute)
							env.lexicons[env.lexicons.length - 1] = obj.lexicon;
						else
							env.lexicons.push(obj.lexicon); // push lexicon to scope
						env.currentLexicon = obj.lexicon;
						const newParent = b(obj.lexicon, env.asFirstLevel);
						newParent._lexems = parent._lexems;
						parent.__swapped__ = newParent;
					} else { // use current babelute lexicon
						parent = parent.__swapped__ || parent;
						getMethod(parent, obj.name).apply(parent, obj.args);
					}
				}
			})
			.done((env, babelute) => {
				if (babelute.__swapped__) {
					// 'scoped' lexicon management :
					// one lexicon has been pushed from this babelute
					// so pop to parent lexicon
					env.lexicons.pop();
					env.currentLexicon = env.lexicons[env.lexicons.length - 1];
					babelute.__swapped__ = null;
				}
			})
			.space(),

		lexem: r.oneOf(
			// lexem (aka: name(arg1, arg2, ...))
			r.terminal(/^([\w-_]+)\s*\(\s*/, (env, obj, cap) => { // lexem name + ' ( '
				obj.name = cap[1];
				obj.args = [];
			})
			.oneOf(
				r.terminal(/^\s*\)/), // end parenthesis

				r.oneOrMore({ // arguments
					rule: 'value',
					separator: r.terminal(/^\s*,\s*/),
					pushTo(env, parent, obj) {
						// Parser.counts.countLexemValues++;
						parent.args.push(obj.value);
					}
				})
				.terminal(/^\s*\)/) // end parenthesis
			),

			// lexicon selector (aka #lexicon:)
			r.terminal(/^#([\w-_]+):/, (env, obj, cap) => { // '@' + lexicon name + ':'
				obj.lexicon = cap[1];
			})
		),


		/***********
		 * VALUES
		 ***********/
		value: r
			.done((env, obj) => {
				if (!env.string.length) {
					env.error = true;
					return;
				}
				// shortcut with first char previsu through valueMap
				env.parser.exec(valuePrevisuMap[env.string[0]] || 'wordValue', obj, env);
			}),

		number: r.terminal(/^[0-9]+(\.[0-9]+)?/, (env, obj, cap) => {
			obj.value = cap[1] ? parseFloat(cap[0] + cap[1], 10) : parseInt(cap[0], 10);
		}),
		singlestring: r.terminal(/^'((?:\\'|[^'])*)'/, (env, obj, cap) => {
			obj.value = cap[1].replace(replaceSingleString, "'");
		}),
		doublestring: r.terminal(/^"((?:\\"|[^"])*)"/, (env, obj, cap) => {
			obj.value = cap[1].replace(replaceDoubleString, '"');
		}),

		wordValue: r
			.oneOf(
				// true|false|null|undefined|NaN|Infinity
				r.terminal(/^(?:true|false|null|undefined|NaN|Infinity)/, (env, obj, cap) => {
					switch (cap[0]) {
						case 'true':
							obj.value = true;
							break;
						case 'false':
							obj.value = false;
							break;
						case 'null':
							obj.value = null;
							break;
						case 'undefined':
							obj.value = undefined;
							break;
						case 'NaN':
							obj.value = NaN;
							break;
						case 'Infinity':
							obj.value = Infinity;
							break;
					}
				}),
				// function
				r.one({
					rule: 'function',
					// previsu: 'f',
					set(env, parent, obj) {
						if (env.acceptFunctions) // todo : add warning when not allowed but present
							parent.value = Function.apply(null, obj.args.concat(obj.block));
					}
				}),
				// babelutes
				r.one({
					rule: 'babelute',
					as(env) {
						return b(env.currentLexicon, env.asFirstLevel);
					},
					set(env, parent, obj) {
						parent.value = obj;
					}
				})
			),

		object: r.one({
			rule: r
				.terminal(/^\{\s*/) // start bracket
				.zeroOrMore({ // properties
					rule: r
						// key
						.terminal(/^([\w-_]+)|"([^"]*)"|'([^']*)'/, (env, obj, cap) => {
							obj.key = cap[1];
						})
						.terminal(/^\s*:\s*/)
						// value
						.one('value'),
					separator: r.terminal(/^\s*,\s*/),
					pushTo(env, parent, obj) {
						parent[obj.key] = obj.value;
					}
				})
				.terminal(/^\s*\}/), // end bracket

			set(env, parent, obj) {
				parent.value = obj;
			}
		}),

		array: r.one({
			rule: r.terminal(/^\[\s*/) // start square bracket
				.zeroOrMore({ // items
					rule: 'value',
					separator: r.terminal(/^\s*,\s*/),
					pushTo(env, parent, obj) {
						parent.push(obj.value);
					}
				})
				.terminal(/^\s*\]/), // end square bracket

			as() {
				return [];
			},
			set(env, parent, obj) {
				parent.value = obj;
			}
		}),

		function: r
			.terminal(/^function\s*\(\s*/, (env, obj) => {
				obj.args = [];
				obj.block = '';
			})
			.zeroOrMore({ // arguments key
				rule: r.terminal(/^[\w-_]+/, 'key'),
				separator: r.terminal(/^\s*,\s*/),
				pushTo(env, parent, obj) {
					parent.args.push(obj.key);
				}
			})
			.terminal(/^\s*\)\s*\{/)
			.one('scopeBlock')
			.done((env, obj) => {
				// remove last uneeded '}' in catched block (it's there for inner-blocks recursion)
				obj.block = obj.block.substring(0, obj.block.length - 1);
			}),

		scopeBlock: r // function scope block (after first '{')
			.oneOf(
				// inner block recursion
				r.terminal(/^[^\{\}]*\{/, (env, obj, cap) => {
					obj.block += cap[0];
				})
				.oneOrMore('scopeBlock'),

				// end block 
				r.terminal(/^[^\}]*\}/, (env, obj, cap) => {
					obj.block += cap[0];
				})
			)
	},
	parser = new Parser(rules);

/**
 * parse UUS string to babelute instance
 * @param  {string} string the UUS string to parse
 * @param  {Object={}} opt    options
 * @return {Babelute}      the deserialized babelute instance
 * @public
 */
function fromUUS(string, opt = {}) {
	const env = {};
	Object.assign(env, opt);
	env.lexicons = [opt.mainLexic];
	env.currentLexicon = opt.mainLexic || null;
	return parser.parse(string, 'babelute', b(opt.mainLexic, env.asFirstLevel), env);
}

function getMethod(parent, name) {
	const method = parent[name];
	if (!method)
		throw new Error('Babelute : no lexem found in current lexicon (' + (parent.__babelute__ || 'default') + ') with :' + name);
	return method;
}

export default fromUUS;

//

