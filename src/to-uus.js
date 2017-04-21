/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */

/********************************************************************
 ********************************************************************
 * Stringify Babelute to serialised form (beautified or minified)
 ********************************************************************
 ********************************************************************/

// utils
function pushLexicScope(opt, lexicon, alreadyPushed) {
	if (alreadyPushed)
		opt.lexicScope[opt.lexicScope.length - 1] = lexicon;
	else
		opt.lexicScope.push(lexicon);
	opt.currentLexic = lexicon;
	return true;
}

function popLexicScope(opt) {
	opt.lexicScope.pop();
	opt.currentLexic = opt.lexicScope[opt.lexicScope.length - 1];
}

function removeLastUndefined(arr) {
	const len = arr.length;
	let index = len;
	while (index && arr[index - 1] === undefined)
		index--;
	if (index < len)
		arr.splice(index, len - index);
	return arr;
}

/********************************************************************
 ********** beautyfy
 ********************************************************************/

function beautyLexems(lexems, opt) {
	const lexemsOutput = [];
	let outlength = 0,
		item,
		args,
		lexicPushed = false,
		out;
	for (let i = 0, len = lexems.length; i < len; ++i) {
		item = lexems[i];
		if (item.lexicon !== opt.currentLexic) {
			out = '#' + item.lexicon + ':';
			lexemsOutput.push(out);
			lexicPushed = pushLexicScope(opt, item.lexicon, lexicPushed);
		}
		if (item.args && item.args.length) {
			args = beautyArrayValues(removeLastUndefined(item.args), opt);
			if ((item.args.length > 1 || (item.args[0] && item.args[0].__babelute__)) && args.length > opt.maxLength) // add EOL
				out = item.name + '(\n\t' + args.replace(/\n/g, (s) => {
					return s + '\t';
				}) + '\n)';
			else
				out = item.name + '(' + args + ')';
		} else
			out = item.name + '()';

		lexemsOutput.push(out);
		outlength += out.length;
	}
	if (lexicPushed)
		popLexicScope(opt);
	outlength += lexems.length - 1;
	return lexemsOutput.join((outlength > opt.maxLength) ? '\n' : ' ');
}

function beautyArray(arr, opt) {
	const len = arr.length;
	if (!len)
		return '[]';
	const out = beautyArrayValues(arr, opt),
		addReturn = (len > 1 && out.length > opt.maxLength);
	if (addReturn)
		return '[\n\t' + out.replace(/\n/g, (s) => {
			return s + '\t';
		}) + '\n]';
	return '[' + out + ']';
}

function beautyArrayValues(arr, opt) {
	const len = arr.length;
	// if (!len)
	// return '';
	const values = [];
	let out,
		outlength = 0;
	for (let i = 0; i < len; ++i) {
		out = valueToString(arr[i], opt);
		values.push(out);
		outlength += out.length;
	}
	outlength += len - 1;
	return values.join((outlength > opt.maxLength) ? ',\n' : ', ');
}

function beautyObject(obj, opt) {
	const keys = Object.keys(obj);
	const out = beautyProperties(obj, keys, opt);
	if (keys.length > 1 && out.length > opt.maxLength) { // add returns
		return '{\n\t' + out.replace(/\n/g, (s) => {
			return s + '\t';
		}) + '\n}';
	}
	return '{ ' + out + ' }';
}

function beautyProperties(obj, keys, opt) {
	const values = [];
	let out,
		outlength = 0,
		key;
	for (let i = 0, len = keys.length; i < len; ++i) {
		key = keys[i];
		out = valueToString(obj[key], opt);
		outlength += out.length;
		values.push(key + ': ' + out);
	}
	outlength += keys.length - 1;
	return (outlength > opt.maxLength) ? values.join(',\n') : values.join(', ');
}


/********************************************************************
 ********** minify
 ********************************************************************/

function valueToString(val, opt) {
	if (!val)
		return val + '';
	let out;
	switch (typeof val) {
		case 'object':
			if (val.__babelute__)
				return toUUS(val, opt);
			if (val.forEach)
				return (opt.beautify) ? beautyArray(val, opt) : '[' + arrayToString(val, opt) + ']';
			return (opt.beautify) ? beautyObject(val, opt) : objectToString(val, opt);
		case 'string':
			// return '"' + val.replace(/"/g, '\\"') + '"'; // adds quotes and escapes content
			return JSON.stringify(val); // adds quotes and escapes content
		case 'function':
			out = (val + '').replace(/anonymous/, '').replace(/\n\/\*\*\//, '');
			return opt.beautify ? out : out.replace(/`[^`]*`|\n\s*/g, (val) => {
				return val[0] === "`" ? val : ' ';
			});
		default:
			return val + '';
	}
}

function arrayToString(arr, opt) {
	if (!arr.length)
		return '';
	// map output
	let out = '';
	for (let i = 0, len = arr.length; i < len; ++i)
		out += (i ? ',' : '') + valueToString(arr[i], opt);
	return out;
}

function objectToString(obj, opt) {
	const keys = Object.keys(obj);
	let out = '';
	for (let i = 0, len = keys.length, key; i < len; ++i) {
		key = keys[i];
		out += (i ? ',' : '') + key + ':' + valueToString(obj[key], opt);
	}
	return '{' + out + '}';
}

/********************************************************************
 ********** end minify
 ********************************************************************/

/**
 * Stringify a babelute instance to UUS
 * @param  {Babelute} babelute the babelute instance to serialize
 * @param  {Object={}} opt      options
 * @return {string}          the resulting UUS string
 * @todo  manage options.pragmatics map for custom output
 */
function toUUS(babelute, opt = {}) {

	opt.lexicScope = opt.lexicScope || [];

	if (opt.beautify) {
		opt.maxLength = opt.maxLength || 20;
		return beautyLexems(babelute._lexems, opt);
	}

	// else minifiy lexems
	const lexems = babelute._lexems;
	let	out = '',
		item,
		lexicPushed = false;
	for (let i = 0, len = lexems.length; i < len; ++i) {
		item = lexems[i];
		if (item.lexicon !== opt.currentLexic) {
			out += '#' + item.lexicon + ':';
			lexicPushed = pushLexicScope(opt, item.lexicon, lexicPushed);
		}
		out += item.name + '(' + (item.args && item.args.length ? arrayToString(removeLastUndefined(item.args), opt) : '') + ')';
	}

	if (lexicPushed)
		popLexicScope(opt);

	return out;
}

export default toUUS;

