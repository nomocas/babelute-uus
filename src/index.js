/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */
import babelute from 'babelute';
// serializer to Babelute DSL
import toUUS from './to-uus.js';
// Babelute DSL parser
import fromUUS from './from-uus.js';

babelute.fromUUS = fromUUS;
babelute.toUUS = toUUS;

babelute.Babelute.prototype.$toUUS = function(opt) {
	return toUUS(this, opt);
};

export default {
	fromUUS,
	toUUS
};

