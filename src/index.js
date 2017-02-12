/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */
import bbl from 'babelute';
// serializer to Babelute DSL
import toUUS from './to-uus.js';
// Babelute DSL parser
import fromUUS from './from-uus.js';

const babelute = bbl;

babelute.fromUUS = fromUUS;
babelute.toUUS = toUUS;

/**
 * export babelute core ({@link https://github.com/nomocas/babelute}) decorated with fromUUS/toUUS
 * @type {Object}
 * @public
 */
export default babelute;