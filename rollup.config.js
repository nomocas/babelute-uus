import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');
// const external = Object.keys(pkg.dependencies);

export default {
	entry: 'src/index.js',
	plugins: [
		babel(babelrc({
			externalHelpers: true
		})),
		nodeResolve(),
		commonjs()
	],
	external: ['babelute'],
	// external,
	targets: [{
		dest: pkg.main,
		format: 'umd',
		moduleName: 'babeluteuus',
		sourceMap: true
	}, {
		dest: pkg.module,
		format: 'es',
		sourceMap: true
	}]
};

