var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// removed in production

/**
 * Lexem class : a lexem is just an object containing 3 properties { lexicon:String, name:String, args:Arguments|Array }
 * You should never construct them directly (but if you do babelute's plugins). And it should never be extended.
 * @protected
 */
var Lexem =

/**
 * construct a new lexem instance
 * @param  {String} lexicon the lexicon's name of the lexem
 * @param  {String} name    the lexem's name
 * @param  {Array|arguments} args  the lexem's arguments (an array or the "callee arguments" object) 
 */
function Lexem(lexicon, name, args) {
	classCallCheck(this, Lexem);


	/**
  * the lexicon name from where the lexem comes
  * @type {String}
  */
	this.lexicon = lexicon;

	/**
  * the lexem's name
  * @type {String}
  */
	this.name = name;

	/**
  * The lexem's arguments array (or arguments object)
  * @type {Array|arguments}
  */
	this.args = args;
};

/**
 * Babelute subclass(es) instances : for holding array of lexems (i.e. a sentence) written through the DSL's API.
 *
 * Will be the base class for all DSLs handlers.
 *
 * Babelute API and lexems Naming Conventions : 
 * 
 * - any "meta-language" method (aka any method that handle the sentence it self - appending new lexem, changing current lexicon, sentences translations, ...) 
 * must start with and underscore : e.g. _append, _lexicon, _if,  _each, _eachLexem, _translate...
 * - any "pragmatics output related" method should start with a '$' and should be named with followed format : e.g. .$myLexiconToMyOutputType(...)
 * - any DSL lexems (so any other "api"'s method) should start with a simple alphabetic char : e.g. .myLexem(), .description(), .title(), ...
 * 		
 * @public
 */
/**
 * Babelute core
 *
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016-2017 Gilles Coomans
 */

var Babelute = function () {

	/**
  * construct a babelute instance
  * @param  {?Array} lexems array of lexems for init. (only for internal use)
  */
	function Babelute() {
		var lexems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		classCallCheck(this, Babelute);


		/**
   * the array where lexems are stored
   * @type {Array}
   */
		this._lexems = lexems || [];

		/**
   * useful marker for fast instanceof replacement (frame/multiple-js-runtime friendly)
   * @type {Boolean}
   */
		this.__babelute__ = true;
	}

	/**
  * The absolute Babelute atom method : add a lexem to babelute's array
  * @public
  * @param  {String} lexiconName the current lexicon name
  * @param  {String} name      the lexem's name
  * @param  {Array|arguments} args   the lexem's arguments (either an array or maybe directly the arguments object from when lexem is called)
  * @return {Babelute} 	the current Babelute instance
  */


	createClass(Babelute, [{
		key: '_append',
		value: function _append(lexiconName, name, args) {

			this._lexems.push(new Lexem(lexiconName, name, args));

			return this;
		}

		/**
   * conditional sentences concatenation.
   *
   * Apply modification at sentence writing time (aka the babelute does not contains the _if lexems. _if has immediatly been applied).
   * 
   * @public
   * @param  {*} condition any value that will be casted to Boolean (!!)
   * @param  {Babelute} babelute  which sentence to insert if !!condition === true
   * @param  {?Babelute} elseBabelute  which sentence to insert if !!condition === false
   * @return {Babelute}     the current Babelute instance
   */

	}, {
		key: '_if',
		value: function _if(condition, babelute) {
			var elseBabelute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


			if (condition) this._lexems = this._lexems.concat(babelute._lexems);else if (elseBabelute) this._lexems = this._lexems.concat(elseBabelute._lexems);
			return this;
		}

		/**
   * For each item from array : execute function and concatenate returned babelute sentence to current one. 
   * Provided function must return a babelute.
   *
   * Apply modification at sentence writing time (aka the babelute does not contains the _each lexems. _each has immediatly been applied).
   * 
   * @public
   * @param  {Array} array  the array to iterate on
   * @param  {Function} func the function to handle each item. it must return a babelute.
   * @return {Babelute}     the current Babelute instance
   */

	}, {
		key: '_each',
		value: function _each(array, func) {
			var _this = this;

			array.forEach(function (item, index) {
				var b = func(item, index);

				_this._lexems.push.apply(_this._lexems, b._lexems);
			});
			return this;
		}

		/**
   * Use a babelute (another sentence) at this point in the current sentence
   * @public
   * @param  {string|Babelute} babelute Either a string formatted as 'mylexicon:myMethod' (which gives the lexem's method to call), or a Babelute instance (which will be inserted in current sentence)
   * @param  {?...args} args the optional arguments to use when calling lexem (only if first argument is a string)
   * @return {Babelute} the current Babelute instance
   * @throws {Error} If lexicon not found (when first arg is string)
   * @throws {Error} If method not found in lexicon (when first arg is string)
   */

	}, {
		key: '_use',
		value: function _use(babelute) {} // eslint-disable-line no-unused-vars
		// will be implemented in lexicon


		/**
   * Change current lexicon for next lexems
   * @public
   * @param  {string} lexiconName the lexicon to use
   * @return {Babelute}  a new Babelute from lexicon (i.e. with lexicon's API)
   * @throws {Error} If lexicon not found with lexiconName
   */

	}, {
		key: '_lexicon',
		value: function _lexicon(lexiconName) {}

		/**
   * Create Babelute subclass
   * @param  {Babelute} BaseClass the class to be extended
   * @param  {?Object} api an object containing methods to add to prototype
   * @return {Babelute}   The subclass
   * @throws {AssertionError} (only in dev mode) If BaseClass is not a Babelute Subclass (or Babelute)
   */

	}], [{
		key: 'extends',
		value: function _extends(BaseClass) {
			var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var B = function B(lexems) {
				BaseClass.call(this, lexems);
			};
			B.prototype = Object.create(BaseClass.prototype);
			B.prototype.constructor = B;
			for (var i in api) {
				// Object.assign seems to bug when used on prototype (not investigate enough : so use plain old for-in syntax)
				B.prototype[i] = api[i];
			}return B;
		}
	}]);
	return Babelute;
}();

/**
 * deserialize json to babelute
 * @param  {String} json the json string
 * @return {Babelute}      the deserialized babelute
 * @throws {Error} If json is badly formated
 */
function fromJSON(json) {
	return JSON.parse(json, function (k, v) {
		if (v && v.__babelute__) return new Babelute(v._lexems.map(function (lexem) {
			return new Lexem(lexem.lexicon, lexem.name, lexem.args);
		}));
		return v;
	});
}

// removed in production
/**
 * A FirstLevel is a Babelute that has exactly same api than its corresponding Babelute (from a DSL) but where every compounds methods has been replaced by its "atomic" equivalent.
 * (Same concept than 'first-level of understanding', as if we where stupid by always understanding only first literal sens of words.)
 * 
 * It provides sentences and lexems without any interpretation, and that could be really useful : e.g.
 * - to see sentence as "editable document" and/or for allowing meta-writing of sentences
 * - to obtain the full AST of babelute sentences 
 * 
 * @access protected
 */
/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2017 Gilles Coomans
 */

var FirstLevel = function (_Babelute) {
	inherits(FirstLevel, _Babelute);

	/**
  * construct a firstlevel babelute instance
  * @param  {?Array} lexems array of lexems for init. (only for internal use)
  */
	function FirstLevel(lexems) {
		classCallCheck(this, FirstLevel);

		var _this = possibleConstructorReturn(this, (FirstLevel.__proto__ || Object.getPrototypeOf(FirstLevel)).call(this, lexems));

		_this.__first_level_babelute__ = true;
		return _this;
	}

	/**
  * return a FirstLevelMethod aka a method that only append an atom (lexicon, name, args)
  * @param  {String} lexiconName the lexicon name of the appended atom
  * @param  {String} lexemName  the lexem name of the appended atom
  * @return {Function}           a function that append the atom
  */


	createClass(FirstLevel, null, [{
		key: 'getFirstLevelMethod',
		value: function getFirstLevelMethod(lexiconName, lexemName) {
			return function () {
				this._lexems.push(new Lexem(lexiconName, lexemName, arguments));
				return this;
			};
		}
	}]);
	return FirstLevel;
}(Babelute);

// removed in production

/**
 * Initializer Class
 * @protected
 */
/*
* @Author: Gilles Coomans
* @Date:   2017-03-10 13:25:25
* @Last Modified by:   Gilles Coomans
* @Last Modified time: 2017-03-10 22:31:48
*/

var Initializer = function () {
	function Initializer() {
		classCallCheck(this, Initializer);
	}

	createClass(Initializer, null, [{
		key: 'extends',

		/**
   * extends Initializer
   * @param  {[type]} BaseInitializer [description]
   * @return {[type]}                 [description]
   */
		value: function _extends(BaseInitializer) {

			var Class = function Class() {};
			Class.prototype = Object.create(BaseInitializer.prototype);
			Class.prototype.constructor = Class;
			return Class;
		}
	}]);
	return Initializer;
}();

/**
 * create a Initializer (based on a Babelute subclass) and instanciate it
 * @param  {Babelute} BabeluteClass   a Babelute subclass from where create initializer
 * @param  {?Initializer} BaseInitializer a parent initializer to be extended (optional)
 * @return {Initializer}               the Initializer instance
 * @protected
 */


function createInitializer(BabeluteClass) {
	var BaseInitializer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	var Init = BabeluteClass.Initializer = BaseInitializer ? Initializer.extends(BaseInitializer) : Initializer;
	BabeluteClass.initializer = new Init();
	BabeluteClass.initializer._empty = function () {
		return new BabeluteClass();
	};
	BabeluteClass.initializer.BabeluteClass = BabeluteClass;
	Object.keys(BabeluteClass).forEach(function (i) {
		addToInitializer(Init, i);
	});
	return BabeluteClass.initializer;
}

/**
 * add method to initializer
 * @protected
 * @param {Initializer} Initializer Initializer class where add methods in proto
 * @param {string} methodName  the name of method to add
 */
function addToInitializer(Initializer, methodName) {
	Initializer.prototype[methodName] = function () {
		return this.BabeluteClass.prototype[methodName].apply(new this.BabeluteClass(), arguments);
	};
}

// removed in production
/**
 * Lexicons dico : where to store public lexicon
 * @type {Object}
 * @private
 */
var lexicons = {};

/**
 * Lexicon class : helpers to store and manage DSL's API.
 * 
 * A __Lexicon__ is just an object aimed to handle, store and construct easily a DSL (its lexic - i.e. the bunch of words that compose it)
 * and its related Atomic/FirstLevel/SecondLevel Babelute subclasses, and their initializers.
 *
 * One DSL = One lexicon.
 *
 * A lexicon could extend another lexicon to manage dialects.
 *
 * You should never use frontaly the constructor (aka never use new Lexicon in  your app). Use createLexicon in place.
 * 
 * @public
 */

var Lexicon = function () {

	/**
  * @param  {string} name   the lexicon name
  * @param  {?Lexicon} parent an optional parent lexicon to be extended here
  */
	function Lexicon(name) {
		var _this = this;

		var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		classCallCheck(this, Lexicon); // all assertions will be removed in production

		/**
   * the parent lexicon (if any)
   * @type {Lexicon}
   * @public
   */
		this.parent = parent;
		parent = parent || {};

		/**
   * the lexicon's name
   * @type {String}
   */
		this.name = name;

		// the three APIs :
		/**
   * interpretable sentences API (finally always made from syntactical atoms (aka last level))
   * @type {Babelute}
   * @protected
   */
		this.Atomic = initClass(parent.Atomic || Babelute);
		/**
   * "document" sentences API (first level : aka all methods has been replaced by fake atomic methods)
   * @type {Babelute}
   * @protected
   */
		this.FirstLevel = initClass(parent.FirstLevel || FirstLevel);
		/**
   * AST-provider API aka the whole tree between first level and last level. Never use it directly : its used under the hood by {@link developOneLevel} method.
   * @type {Babelute}
   * @protected
   */
		this.SecondLevel = Babelute.extends(parent.SecondLevel || Babelute);

		/**
   * the secondLevel instance
   * @type {Babelute}
   * @protected
   */
		this.secondLevel = new this.SecondLevel();

		if (parent.Atomic) Object.keys(parent.Atomic.initializer).forEach(function (key) {
			addToInitializer(_this.Atomic.Initializer, key);
			addToInitializer(_this.FirstLevel.Initializer, key);
		});
	}

	/**
  * add atomic lexem (atoms) to lexicon
  * @param {string[]} atomsArray array of atoms name (as string)
  * @return {Lexicon} the lexicon itself
  */


	createClass(Lexicon, [{
		key: 'addAtoms',
		value: function addAtoms(atomsArray) {
			var _this2 = this;

			atomsArray.forEach(function (name) {
				return addAtom(_this2, name);
			});

			return this;
		}

		/**
   * add compounds lexems to lexicon
   * @param {Function} producer a function that take a babelute initializer as argument and that return an object containing methods (lexems) to add to lexicon
   * @return {Lexicon} the lexicon itself
   */

	}, {
		key: 'addCompounds',
		value: function addCompounds(producer) {
			var _this3 = this;

			// Atomic API is produced with Atomic initializer
			var atomicMethods = producer(this.Atomic.initializer);

			for (var i in atomicMethods) {
				this.Atomic.prototype[i] = atomicMethods[i];
			} // SecondLevel API is simply produced with the related FirstLevel initializer. 
			// (so same producer method, same api, but different handler for inner composition)
			// is the only thing to do to gain capability to handle full AST. (see docs)
			var secondLevelCompounds = producer(this.FirstLevel.initializer);
			for (var j in secondLevelCompounds) {
				this.SecondLevel.prototype[j] = secondLevelCompounds[j];
			}Object.keys(atomicMethods).forEach(function (key) {
				_this3.FirstLevel.prototype[key] = FirstLevel.getFirstLevelMethod(_this3.name, key);
				addToInitializer(_this3.Atomic.Initializer, key);
				addToInitializer(_this3.FirstLevel.Initializer, key);
			});
			return this;
		}

		/**
   * add aliases lexems to lexicon (aliases are like shortcuts : they are added as this to Atomic, FirstLevel and SecondLevel API)
   * @param {Object} methods an object containing methods (lexems) to add to lexicon
   * @return {Lexicon} the lexicon itself
   */

	}, {
		key: 'addAliases',
		value: function addAliases(methods) {
			var _this4 = this;

			Object.keys(methods).forEach(function (key) {
				_this4.Atomic.prototype[key] = _this4.FirstLevel.prototype[key] = _this4.SecondLevel.prototype[key] = methods[key];
				addToInitializer(_this4.Atomic.Initializer, key);
				addToInitializer(_this4.FirstLevel.Initializer, key);
			});
			return this;
		}

		/**
   * @protected
   */

	}, {
		key: 'use',
		value: function use(babelute, name, args, firstLevel) {

			var instance = firstLevel ? this.FirstLevel.instance : this.Atomic.instance;

			if (!instance[name]) throw new Error('Babelute (' + this.name + ') : method not found : ' + name);
			instance[name].apply(babelute, args);
		}

		/**
   * @protected
   */

	}, {
		key: 'translateToAtomic',
		value: function translateToAtomic(babelute, targets) {
			return translate(babelute, this.Atomic, targets || this.targets);
		}

		/**
   * @protected
   */

	}, {
		key: 'translateToFirstLevel',
		value: function translateToFirstLevel(babelute, targets) {
			return translate(babelute, this.FirstLevel, targets || this.targets);
		}

		/**
   * return lexicon's initializer instance. (atomic or firstlevel depending on argument)
   * @public
   * @param  {Boolean} firstLevel true if you want firstLevel initializer, false overwise.
   * @return {Initializer}           the needed initializer instance
   */

	}, {
		key: 'initializer',
		value: function initializer(firstLevel) {
			return firstLevel ? this.FirstLevel.initializer : this.Atomic.initializer;
		}
	}]);
	return Lexicon;
}();

/**
 *  Add syntactical atom lexem to lexicon (actually to inner classes that reflect API). A syntactical Atom method is a function that only add one lexem.
 *  @private
 */


function addAtom(lexicon, name) {

	lexicon.Atomic.prototype[name] = lexicon.FirstLevel.prototype[name] = lexicon.SecondLevel.prototype[name] = FirstLevel.getFirstLevelMethod(lexicon.name, name);
	addToInitializer(lexicon.Atomic.Initializer, name);
	addToInitializer(lexicon.FirstLevel.Initializer, name);
}

/**
 * babelute lexicon's Classes initialisation
 * @private
 */
function initClass(BaseClass) {
	var Class = Babelute.extends(BaseClass);
	createInitializer(Class, BaseClass.Initializer);
	Class.instance = new Class();
	return Class;
}

/**
 * Way to create lexicon instances
 * @public
 * @param  {string} name   the name of the lexicon
 * @param  {Lexicon} parent a lexicon instance as parent for this one (optional)
 * @return {Lexicon}      a lexicon instance
 */
function createLexicon(name) {
	var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	return new Lexicon(name, parent);
}

/**
 * getLexicon registred lexicon by name
 * 
 * @param  {string} lexiconName the lexicon's name
 * @return {Lexicon}      the lexicon
 * @throws {Error} If lexicon not found with lexiconName
 */
function getLexicon(lexiconName) {

	var lexicon = lexicons[lexiconName];
	if (!lexicon) throw new Error('lexicon not found : ' + lexiconName);
	return lexicon;
}

/**
 * registerLexicon lexicon by name
 * @param  {Lexicon} lexicon the lexicon instance to registerLexicon
 * @param  {?string} name    lexicon name (optional : if not provided : use the one from lexicon itself)
 */
function registerLexicon(lexicon) {
	var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	lexicons[name || lexicon.name] = lexicon;
}

/*
 * _lexicon handeling
 */

// implementation of already declared method in Babelute's proto
Babelute.prototype._lexicon = function (lexiconName) {
	return new (getLexicon(lexiconName).Atomic)(this._lexems);
};

FirstLevel.prototype._lexicon = function (lexiconName) {
	return new (getLexicon(lexiconName).FirstLevel)(this._lexems);
};

/**
 * _use handeling
 */

// implementation of already declared method in Babelute's proto
Babelute.prototype._use = function (babelute /* could be a string in "lexiconName:methodName" format */) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	return babelute ? use(this, babelute, args, false) : this;
};

// implementation of already declared method in Babelute's proto
FirstLevel.prototype._use = function (babelute /* could be a string in "lexiconName:methodName" format */ /*, ...args */) {
	return babelute ? use(this, babelute, [].slice.call(arguments, 1), true) : this;
};

function use(self, babelute, args, firstLevel) {
	if (typeof babelute === 'string') {
		var _babelute$split = babelute.split(':'),
		    lexiconName = _babelute$split.lexiconName,
		    methodName = _babelute$split.methodName;

		getLexicon(lexiconName).use(self, methodName, args, firstLevel);
	} else if (babelute.__babelute__) self._lexems = self._lexems.concat(babelute._lexems);
	return self;
}

/**
 * Translation
 */
function translate(babelute, BabeluteClass, targets) {
	var b = new BabeluteClass();
	babelute._lexems.forEach(function (lexem) {
		if (targets && !targets[lexem.lexicon] || this[lexem.name]) // simply forwards lexem (copy) if not in targets
			this._lexems.push(new Lexem(lexem.lexicon, lexem.name, lexem.args));else this[lexem.name].apply(this, lexem.args.map(function (value) {
			if (!value || !value.__babelute__) return value;
			return translate(value, BabeluteClass, targets);
		}));
	}, b);
	return b;
}

/**
 * return a new babelute from needed lexicon
 * @param  {string} lexiconName             the lexicon from where to take api
 * @param  {Boolean} asFirstLevel  True if it needs to return a FirstLevel instance. False or ommitted : returns an Atomic instance.
 * @return {[type]}                  the babelute instance (either an Atomic or a FirstLevel)
 * @throws {Error} If lexicon not found with lexiconName
 */
function init(lexiconName, asFirstLevel) {
	if (lexiconName) return new (getLexicon(lexiconName)[asFirstLevel ? 'FirstLevel' : 'Atomic'])();else if (asFirstLevel) return new FirstLevel();
	return new Babelute();
}

/**
 * develop a FirstLevel compounds-words-lexem through SecondLevel API. It returns the FirstLevel sentence corresponding to lexem's semantic developement.
 * @param  {Lexem} lexem the lexem to develop
 * @param {?Lexicon} lexicon the optional lexicon to use
 * @return {FirstLevel} the developed sentence
 * @throws {Error} If lexicon not found with lexem.lexicon
 * @throws {Error} If method not found in lexicon
 */
function developOneLevel(lexem) {
	var lexicon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	lexicon = lexicon || getLexicon(lexem.lexicon);

	return lexicon.secondLevel[lexem.name].apply(new lexicon.FirstLevel(), lexem.args);
}

/**
 * develop a FirstLevel lexem through Atomic API. Return the atomic representation of the lexem (in its own language).
 * @param  {Lexem} lexem the lexem to develop
 * @param {?Lexicon} lexicon the optional lexicon to use
 * @return {Babelute} the developed sentence
 * @throws {Error} If lexicon not found with lexem.lexicon
 * @throws {Error} If method not found in lexicon
 */
function developToAtoms(lexem) {
	var lexicon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	lexicon = lexicon || getLexicon(lexem.lexicon);

	return lexicon.Atomic.prototype[lexem.name].apply(new lexicon.Atomic(), lexem.args);
}

/**
 * Provide Babelute Subclass "initializer" object (the one with all the flattened shortcut api for starting sentences easily)
 * @param  {string} lexiconName The lexiconName where catch the Babelute Class from where getLexicon or create the initializer object.
 * @param  {boolean} asFirstLevel true if should return a first-level instance. false to return an atomic instance.
 * @return {Object}   An initializer object with shortcuted API from lexicon's Atomic prototype
 * @throws {Error} If lexicon not found with lexiconName
 */
function initializer(lexiconName, asFirstLevel) {
	if (!asFirstLevel) return getLexicon(lexiconName).Atomic.initializer;
	return getLexicon(lexiconName).FirstLevel.initializer;
}

// removed in production

/**
 * Base class to provide homogeneous Pragmatics interface. You should never instanciate a Pragmatics directly with new. use {@link createPragmatics}.
 */
var Pragmatics = function () {

	/**
  * @param  {Object} targets initial targets object
  * @param  {Object} pragmas pragmatics methods to add
  */
	function Pragmatics() {
		var targets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var pragmas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		classCallCheck(this, Pragmatics);


		/**
   * targets holder object
   * @type {Object}
   * @public
   */
		this._targets = targets;

		if (pragmas) this.addPragmas(pragmas);
	}

	/**
  * add methods to pragmatics instance
  * @param {Object} pragmas an object containing methods to add
  */


	createClass(Pragmatics, [{
		key: 'addPragmas',
		value: function addPragmas(pragmas) {

			for (var i in pragmas) {
				/**
     * @ignore
     */
				this[i] = pragmas[i];
			}
		}

		/* istanbul ignore next */
		/**
   * the method used to output a babelute through this pragmatics instance
   * @abstract
   */

	}, {
		key: '$output',
		value: function $output() /* ... */{
			// to be overridden
			throw new Error('pragmatics.$output should be implemented in subclasses');
		}
	}]);
	return Pragmatics;
}();

/**
 * return a new Pragmatics instance. Do not forget to implement $output before usage.
 * @param  {Object} targets initial targets object
 * @param  {Object} pragmas pragmatics methods to add
 * @return {Pragmatics}   the Pragmatics instance
 */
/**
 * Pragmatics Class : minimal abstract class for homogeneous pragmatics.
 *
 * This is the minimal contract that a pragmatics should satisfy.
 *
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016-2017 Gilles Coomans
 */

function createPragmatics() {
	var targets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var pragmas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	return new Pragmatics(targets, pragmas);
}

// removed in production
/**
 * FacadePragmatics : a facade oriented Pragmatics subclass. You should never instanciate a FacadePragmatics directly with new. use {@link createFacadePragmatics}.
 * @example
 * // Remarque : any lexem's method will be of the following format : 
 * function(subject, args, ?percolator){
 * 	// return nothing
 * }
 */
var FacadePragmatics = function (_Pragmatics) {
	inherits(FacadePragmatics, _Pragmatics);

	/**
  * @param  {Object} targets initial targets object
  * @param  {?Object} pragmas pragmatics methods to add
  */
	function FacadePragmatics(targets) {
		var pragmas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		classCallCheck(this, FacadePragmatics);
		return possibleConstructorReturn(this, (FacadePragmatics.__proto__ || Object.getPrototypeOf(FacadePragmatics)).call(this, targets, pragmas));
	}

	/**
  * "each" facade implementation
  * @param  {Object} subject the handled subject
  * @param  {Array|arguments} args  the lexem's args : [ collection:Array, itemHandler:Function ]
  * @param  {?Object} percolator  the sentence's percolator instance
  * @return {void}         nothing
  */


	createClass(FacadePragmatics, [{
		key: 'each',
		value: function each(subject, args /* collection, itemHandler */, percolator) {

			var collec = args[0],
			    itemHandler = args[1];

			if (collec.length) // no supputation on collection kind : use "for"
				for (var i = 0, len = collec.length, item, templ; i < len; ++i) {
					item = collec[i];
					templ = itemHandler(item, i);
					if (templ) this.$output(subject, templ, percolator);
				}
		}

		/**
   * "if" facade implementation 
   * @param  {Object} subject the handled subject
   * @param  {Array|arguments} args  the lexem's args : [ conditionIsTrue:Babelute, conditionIsFalse:Babelute ]
   * @param  {?Object} percolator  the sentence's percolator instance
   * @return {void}         nothing
   */

	}, {
		key: 'if',
		value: function _if(subject, args /* trueBabelute, falseBabelute */, percolator) {

			if (args[0]) this.$output(subject, args[1], percolator);else if (args[2]) this.$output(subject, args[2], percolator);
		}

		/**
   *
   * @override
   * @param  {Object} subject  the subject handle through interpretation
   * @param  {Babelute} babelute the babelute "to interpret on" subject
   * @param  {Scope} percolator   the sentence percolator instance (optional)
   * @return {Object}        the subject
   */

	}, {
		key: '$output',
		value: function $output(subject, babelute) {
			var percolator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


			for (var i = 0, lexem, len = babelute._lexems.length; i < len; ++i) {
				lexem = babelute._lexems[i];
				if (this._targets[lexem.lexicon] && this[lexem.name]) this[lexem.name](subject, lexem.args, percolator);
			}
			return subject;
		}
	}]);
	return FacadePragmatics;
}(Pragmatics);

/**
 * create a facade-ready-to-run initializer function.
 * @param  {Lexicon} lexicon    the lexicon from where take the api
 * @param  {Object} pragmatics   the pragmatics object where to find interpretation method to fire immediatly
 * @return {Function}            the facade initializer function
 * @example
 *
 * import babelute from 'babelute';
 * const myLexicon = babelute.createLexicon('my-lexicon');
 * myLexicon.addAtoms(['foo', 'bar']);
 * 
 * const myPragmas = babelute.createFacadePragmatics({
 * 	'my-lexicon':true
 * }, {
 * 	foo(subject, args, percolator){
 * 		// do something
 * 	},
 * 	bar(subject, args, percolator){
 * 		// do something
 * 	}
 * });
 *
 * const mlp = babelute.createFacadeInitializer(myLexicon, myPragmas);
 *
 * mlp(mySubject).foo(...).bar(...); // apply pragmas immediatly on subject through lexicon api's
 *
 */
function createFacadeInitializer(lexicon, pragmatics) {
	var Facade = function Facade(subject) {
		var percolator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		lexicon.Atomic.call(this);
		this._subject = subject;
		this._percolator = percolator;
	};

	Facade.prototype = Object.create(lexicon.Atomic.prototype);
	Facade.prototype.constructor = Facade;
	Facade.prototype._lexicon = null;
	Facade.prototype._append = function (lexiconName, name, args) {
		if ((!pragmatics._targets || pragmatics._targets[lexiconName]) && pragmatics[name]) pragmatics[name](this._subject, args, this._percolator);
		return this;
	};
	return function (subject) {
		var percolator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		return new Facade(subject, percolator);
	};
}

/**
 * create a FacadePragmatics instance
 * @param  {Object} targets the pragmatics targets DSL
 * @param  {?Object} pragmas the methods to add
 * @return {FacadePragmatics}     the facade pragmatics instance
 * @example
 * const myPragmas = babelute.createFacadePragmatics({
 * 	'my-lexicon':true
 * }, {
 * 	foo(subject, args, percolator){
 * 		// do something
 * 	},
 * 	bar(subject, args, percolator){
 * 		// do something
 * 	}
 * });
 */
function createFacadePragmatics(targets) {
	var pragmas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	return new FacadePragmatics(targets, pragmas);
}

/*
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */

// core classes and functions
// import Scopes from './pragmatics/pragmatics-scopes.js';

var babelute$2 = {
	createLexicon: createLexicon,
	createPragmatics: createPragmatics,
	createFacadeInitializer: createFacadeInitializer,
	createFacadePragmatics: createFacadePragmatics,
	init: init,
	initializer: initializer,
	getLexicon: getLexicon,
	registerLexicon: registerLexicon,
	developOneLevel: developOneLevel,
	developToAtoms: developToAtoms,
	fromJSON: fromJSON,
	Babelute: Babelute,
	Lexem: Lexem,
	Pragmatics: Pragmatics,
	FacadePragmatics: FacadePragmatics
	// Scopes
};

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
	if (alreadyPushed) opt.lexicScope[opt.lexicScope.length - 1] = lexicon;else opt.lexicScope.push(lexicon);
	opt.currentLexic = lexicon;
	return true;
}

function popLexicScope(opt) {
	opt.lexicScope.pop();
	opt.currentLexic = opt.lexicScope[opt.lexicScope.length - 1];
}

function removeLastUndefined(arr) {
	var len = arr.length;
	var index = len;
	while (index && arr[index - 1] === undefined) {
		index--;
	}if (index < len) arr.splice(index, len - index);
	return arr;
}

/********************************************************************
 ********** beautyfy
 ********************************************************************/

function beautyLexems(lexems, opt) {
	var lexemsOutput = [];
	var outlength = 0,
	    item = void 0,
	    args = void 0,
	    lexicPushed = false,
	    out = void 0;
	for (var i = 0, len = lexems.length; i < len; ++i) {
		item = lexems[i];
		if (item.lexicon !== opt.currentLexic) {
			out = '#' + item.lexicon + ':';
			lexemsOutput.push(out);
			lexicPushed = pushLexicScope(opt, item.lexicon, lexicPushed);
		}
		if (item.args) {
			args = beautyArrayValues(removeLastUndefined(item.args), opt);
			if ((item.args.length > 1 || item.args[0] && item.args[0].__babelute__) && args.length > opt.maxLength) // add EOL
				out = item.name + '(\n\t' + args.replace(/\n/g, function (s) {
					return s + '\t';
				}) + '\n)';else out = item.name + '(' + args + ')';
		} else out = item.name + '()';

		lexemsOutput.push(out);
		outlength += out.length;
	}
	if (lexicPushed) popLexicScope(opt);
	outlength += lexems.length - 1;
	return lexemsOutput.join(outlength > opt.maxLength ? '\n' : ' ');
}

function beautyArray(arr, opt) {
	var len = arr.length;
	if (!len) return '[]';
	var out = beautyArrayValues(arr, opt),
	    addReturn = len > 1 && out.length > opt.maxLength;
	if (addReturn) return '[\n\t' + out.replace(/\n/g, function (s) {
		return s + '\t';
	}) + '\n]';
	return '[' + out + ']';
}

function beautyArrayValues(arr, opt) {
	var len = arr.length;
	if (!len) return '';
	var values = [];
	var out = void 0,
	    outlength = 0;
	for (var i = 0; i < len; ++i) {
		out = valueToString(arr[i], opt);
		values.push(out);
		outlength += out.length;
	}
	outlength += len - 1;
	return values.join(outlength > opt.maxLength ? ',\n' : ', ');
}

function beautyObject(obj, opt) {
	var keys = Object.keys(obj);
	var out = beautyProperties(obj, keys, opt);
	if (keys.length > 1 && out.length > opt.maxLength) {
		// add returns
		return '{\n\t' + out.replace(/\n/g, function (s) {
			return s + '\t';
		}) + '\n}';
	}
	return '{ ' + out + ' }';
}

function beautyProperties(obj, keys, opt) {
	var values = [];
	var out = void 0,
	    outlength = 0,
	    key = void 0;
	for (var i = 0, len = keys.length; i < len; ++i) {
		key = keys[i];
		out = valueToString(obj[key], opt);
		outlength += out.length;
		values.push(key + ': ' + out);
	}
	outlength += keys.length - 1;
	return outlength > opt.maxLength ? values.join(',\n') : values.join(', ');
}

/********************************************************************
 ********** minify
 ********************************************************************/

function valueToString(val, opt) {
	if (!val) return val + '';
	var out = void 0;
	switch (typeof val === 'undefined' ? 'undefined' : _typeof(val)) {
		case 'object':
			if (val.__babelute__) return toUUS(val, opt);
			if (val.forEach) return opt.beautify ? beautyArray(val, opt) : '[' + arrayToString(val, opt) + ']';
			return opt.beautify ? beautyObject(val, opt) : objectToString(val, opt);
		case 'string':
			// return '"' + val.replace(/"/g, '\\"') + '"'; // adds quotes and escapes content
			return JSON.stringify(val); // adds quotes and escapes content
		case 'function':
			out = (val + '').replace(/anonymous/, '').replace(/\n\/\*\*\//, '');
			return opt.beautify ? out : out.replace(/`[^`]*`|\n\s*/g, function (val) {
				return val[0] === "`" ? val : ' ';
			});
		default:
			return val + '';
	}
}

function arrayToString(arr, opt) {
	if (!arr.length) return '';
	// map output
	var out = '';
	for (var i = 0, len = arr.length; i < len; ++i) {
		out += (i ? ',' : '') + valueToString(arr[i], opt);
	}return out;
}

function objectToString(obj, opt) {
	var keys = Object.keys(obj);
	var out = '';
	for (var i = 0, len = keys.length, key; i < len; ++i) {
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
function toUUS(babelute) {
	var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	opt.lexicScope = opt.lexicScope || [];

	if (opt.beautify) {
		opt.maxLength = opt.maxLength || 20;
		return beautyLexems(babelute._lexems, opt);
	}

	// else minifiy lexems
	var lexems = babelute._lexems;
	var out = '',
	    item = void 0,
	    lexicPushed = false;
	for (var i = 0, len = lexems.length; i < len; ++i) {
		item = lexems[i];
		if (item.lexicon !== opt.currentLexic) {
			out += '#' + item.lexicon + ':';
			lexicPushed = pushLexicScope(opt, item.lexicon, lexicPushed);
		}
		out += item.name + '(' + (item.args ? arrayToString(removeLastUndefined(item.args), opt) : '') + ')';
	}

	if (lexicPushed) popLexicScope(opt);

	return out;
}

var classCallCheck$1 = function classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
};

var createClass$1 = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}

	return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();

/*
* @Author: Gilles Coomans
* @Last Modified by:   Gilles Coomans
* @Last Modified time: 2017-03-17 15:20:54
*/

/**
 * The Parser class.
 * @public
 */
var Parser$1 = function () {

	/**
  * @param  {Object} rules       an object containing rules
  * @param  {String} defaultRule the default rule to use when parsing
  */
	function Parser(rules, defaultRule) {
		classCallCheck$1(this, Parser);

		/**
   * the rules map
   * @type {Object}
   */
		this.rules = rules;

		/**
   * the default rule's name to use
   * @type {String}
   */
		this.defaultRule = defaultRule;
	}

	/**
  * find rule by name
  * @param  {String} name the rule's name
  * @return {Rule}      the finded rule
  * @throws {Error} If rule not found
  */

	createClass$1(Parser, [{
		key: 'getRule',
		value: function getRule(name) {
			var r = this.rules[name];
			if (!r) throw new Error('elenpi parser : rules not found : ' + name);
			return r;
		}

		/**
   * Parse provided string with specific rule
   * @param  {String} string     the string to parse
   * @param  {String} rule       the name of the rule to apply. default is null (will use parser's default method if not provided).
   * @param  {Object} descriptor the main descriptor object
   * @return {Object}            the decorated descriptor
   * @throws {Error} If parsing fail (for any reason)
   */

	}, {
		key: 'parse',
		value: function parse(string) {
			var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var descriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var env = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			env = env || {};
			env.parser = this;
			env.string = string;
			rule = rule || this.getRule(this.defaultRule);
			Parser.exec(rule, descriptor, env);
			if (!env.error && env.string.length) {
				env.error = true;
				env.errorMessage = 'string wasn\'t parsed entierly';
			}
			if (env.error) {
				var pos = string.length - env.string.length,
				    posInFile = getPositionInFile(string, pos);
				throw new Error('Parsing failed : ' + (env.errorMessage || 'no rules matched') + ' : (line:' + posInFile.line + ' , col:' + posInFile.col + ') near :\n', string.substring(pos, pos + 50));
			}
			return descriptor;
		}

		/**
   * Execute a rule (only for those who developing grammars)
   * @param  {String|Rule} rule      the name of the rule to use or the rule itself
   * @param  {Object} descriptor the descriptor to decorate
   * @param  {Object} env        the inner-job main object where parser, parsed string and eventual errors are stored
   * @return {Void}            nothing
   * @public
   * @throws {Error} If rule is string (so it's a rule's name) and referenced rule could not be found with it.
   */

	}], [{
		key: 'exec',
		value: function exec(rule, descriptor, env) {
			if (env.error) return;
			if (typeof rule === 'string') rule = env.parser.getRule(rule);

			var rules = rule._queue;
			for (var i = 0, current, len = rules.length; i < len; ++i) {
				current = rules[i];
				if (current.__elenpi__) Parser.exec(current, descriptor, env);else // is function
					current(env, descriptor);
				if (env.error) break;
			}
		}
	}]);
	return Parser;
}();

function getPositionInFile(string, position) {
	var splitted = string.split(/\r|\n/),
	    len = splitted.length;
	var lineNumber = 0,
	    current = 0,
	    line = void 0,
	    lineLength = void 0;
	while (lineNumber < len) {
		line = splitted[lineNumber];
		lineLength = line.length;
		if (position <= current + lineLength) break;
		current += lineLength;
		lineNumber++;
	}
	return {
		line: lineNumber + 1,
		col: position - current
	};
}

/*
 * @Author: Gilles Coomans
 */

var defaultSpaceRegExp = /^\s+/;
var exec = Parser$1.exec;

/**
 * The Rule base class.
 * @public
 */

var Rule = function () {

	/**
  * the Rule constructor
  */
	function Rule() {
		classCallCheck$1(this, Rule);

		this._queue = [];
		this.__elenpi__ = true;
	}

	/**
  * the base handler for every other lexems
  * @param  {Function} callback the callback to handle string
  * @return {Rule}          this rule handler
  */

	createClass$1(Rule, [{
		key: 'done',
		value: function done(callback) {
			this._queue.push(callback);
			return this;
		}

		/**
   * use another rule  
   * @param  {String|Rule} rule the rule to use
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'use',
		value: function use(rule) {
			var args = [].slice.call(arguments, 1);
			return this.done(function (env, descriptor) {
				if (typeof rule === 'string') rule = env.parser.getRule(rule);
				if (rule.__elenpi__) {
					exec(rule, descriptor, env);
				} else {
					var _r = new Rule();
					rule.apply(_r, args);
					exec(_r, descriptor, env);
				}
			});
		}

		/**
   * catch a terminal
   * @param  {RegExp} reg the terminal's regexp
   * @param  {String|Function} set either the name of the property (in current descriptor) where store the catched value 
   *                           or a function to handle captured object by hand 
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'terminal',
		value: function terminal(reg, set$$1) {
			return this.done(function (env, descriptor) {
				if (!env.string.length) {
					env.error = true;
					return;
				}
				var cap = reg.exec(env.string);
				if (cap) {
					env.string = env.string.substring(cap[0].length);
					if (set$$1) {
						if (typeof set$$1 === 'string') descriptor[set$$1] = cap[0];else set$$1(env, descriptor, cap);
					}
				} else env.error = true;
			});
		}

		/**
   * match a single character
   * @param  {String} test the caracter to match
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'char',
		value: function char(test) {
			return this.done(function (env) {
				if (!env.string.length || env.string[0] !== test) env.error = true;else env.string = env.string.substring(1);
			});
		}

		/**
   * match x or more element from string with provided rule
   * @param  {Rule|Object} rule either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'xOrMore',
		value: function xOrMore(rule) {
			var opt = typeof rule === 'string' || rule.__elenpi__ ? {
				rule: rule
			} : rule;
			opt.minimum = opt.minimum || 0;
			opt.maximum = opt.maximum || Infinity;
			return this.done(function (env, descriptor) {

				if (opt.minimum && !env.string.length) {
					env.error = true;
					return;
				}

				var rule = opt.rule,
				    pushTo = opt.pushTo,
				    pushToString = typeof pushTo === 'string',
				    As = opt.as,
				    separator = opt.separator;

				var count = 0,
				    currentPosition = void 0,
				    newDescriptor = void 0,
				    restLength = void 0;

				while (env.string.length && count < opt.maximum) {

					newDescriptor = As ? As(env, descriptor) : pushTo ? {} : descriptor;
					currentPosition = env.string.length;

					exec(rule, newDescriptor, env);

					restLength = env.string.length;

					if (env.error) {
						if (currentPosition === restLength) // has not moved deeper : so try next rule
							env.error = false;
						break;
					}

					count++;

					// store new descriptor in parent descriptor
					if (!newDescriptor.skip && pushTo) if (pushToString) {
						descriptor[pushTo] = descriptor[pushTo] || [];
						descriptor[pushTo].push(newDescriptor);
					} else pushTo(env, descriptor, newDescriptor);

					// manage separator
					if (separator && restLength) {
						currentPosition = restLength;
						exec(separator, newDescriptor, env);
						if (env.error) {
							if (currentPosition === env.string.length) env.error = false;
							break;
						}
					}
				}

				if (!env.error && count < opt.minimum) {
					env.error = true;
					env.errorMessage = "missing xOrMore item : " + rule;
				}
			});
		}

		/**
   * match 0 or more element from string with provided rule
   * @param  {Rule|Object} rule either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'zeroOrMore',
		value: function zeroOrMore(rule) {
			return this.xOrMore(rule);
		}

		/**
   * match 1 or more element from string with provided rule
   * @param  {Rule|Object} rule either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'oneOrMore',
		value: function oneOrMore(rule) {
			if (typeof rule === 'string' || rule.__elenpi__) rule = {
				rule: rule,
				minimum: 1
			};else rule.minimum = 1;
			return this.xOrMore(rule);
		}

		/**
   * match one element from string with one of provided rules
   * @param  {Rule|Object} rules either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'oneOf',
		value: function oneOf(rules) {
			var opt = typeof rules === 'string' || rules.__elenpi__ ? {
				rules: [].slice.call(arguments)
			} : rules;
			return this.done(function (env, descriptor) {

				if (!opt.optional && !env.string.length) {
					env.error = true;
					return;
				}

				var len = opt.rules.length,
				    currentPosition = env.string.length;

				var count = 0,
				    rule = void 0,
				    newDescriptor = void 0;

				while (count < len) {
					rule = opt.rules[count++];
					newDescriptor = opt.as ? opt.as(env, descriptor) : opt.set ? {} : descriptor;
					exec(rule, newDescriptor, env);
					if (env.error) {
						if (env.string.length === currentPosition) {
							env.error = false;
							continue;
						}
					} else setDescriptor(descriptor, newDescriptor, opt.set, env);
					return;
				}
				if (!opt.optional) env.error = true;
			});
		}

		/**
   * maybe match one element from string with one of provided rules
   * @param  {Rule|Object} rules either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'maybeOneOf',
		value: function maybeOneOf(rules) {
			var opt = typeof rules === 'string' || rules.__elenpi__ ? {
				rules: [].slice.call(arguments)
			} : rules;
			opt.optional = true;
			return this.oneOf(opt);
		}

		/**
   * match one element from string with provided rule
   * @param  {Rule|Object} rule either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'one',
		value: function one(rule) {
			var opt = typeof rule === 'string' || rule && rule.__elenpi__ ? {
				rule: rule
			} : rule;
			return this.done(function (env, descriptor) {
				if (!opt.optional && !env.string.length) {
					env.error = true;
					return;
				}
				var newDescriptor = opt.as ? opt.as(env, descriptor) : opt.set ? {} : descriptor,
				    currentPosition = env.string.length;

				exec(opt.rule, newDescriptor, env);
				if (!env.error) setDescriptor(descriptor, newDescriptor, opt.set, env);else if (opt.optional && env.string.length === currentPosition) env.error = false;
			});
		}

		/**
   * maybe match one element from string with provided rule
   * @param  {Rule|Object} rule either a rule instance or an option object
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'maybeOne',
		value: function maybeOne(rule) {
			var opt = typeof rule === 'string' || rule && rule.__elenpi__ ? {
				rule: rule
			} : rule;
			opt.optional = true;
			return this.one(opt);
		}

		/**
   * skip current descriptor
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'skip',
		value: function skip() {
			return this.done(function (env, descriptor) {
				descriptor.skip = true;
			});
		}

		/**
   * match a space (any spaces, or carriage returns, or new lines)
   * @param  {Boolean} needed true if space is needed. false otherwise.
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'space',
		value: function space() {
			var needed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			return this.done(function (env) {
				if (!env.string.length) {
					if (needed) env.error = true;
					return;
				}
				var cap = (env.parser.rules.space || defaultSpaceRegExp).exec(env.string);
				if (cap) env.string = env.string.substring(cap[0].length);else if (needed) env.error = true;
			});
		}

		/**
   * match the end of string
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'end',
		value: function end() {
			return this.done(function (env) {
				if (env.string.length) env.error = true;
			});
		}

		/**
   * force end parsing with error. Only aimed to be used in .oneOf().
   * @param  {String} msg the error message.
   * @return {Rule}          this rule handler
   */

	}, {
		key: 'error',
		value: function error(msg) {
			return this.done(function (env) {
				env.error = true;
				env.errorMessage = msg;
			});
		}
	}]);
	return Rule;
}();

function setDescriptor(descriptor, newDescriptor, set$$1, env) {
	if (!newDescriptor.skip && set$$1) if (typeof set$$1 === 'string') descriptor[set$$1] = newDescriptor;else set$$1(env, descriptor, newDescriptor);
}

var r$1 = {};

Object.getOwnPropertyNames(Rule.prototype) // because Babel make prototype methods not enumerable
.forEach(function (key) {
	if (typeof Rule.prototype[key] === 'function') r$1[key] = function () {
		var rule = new Rule();
		return rule[key].apply(rule, arguments);
	};
});

/**
 * Rule initializer object (all the Rul's API for starting rule's sentences)
 * @type {Object}
 * @public
 * @static
 */
Rule.initializer = r$1;

/**
 * elenpi
 * @author Gilles Coomans
 */

/**
 * elenpi export object { Rule, Parser }
 * @type {Object}
 * @public
 */
var elenpi = {
	Rule: Rule,
	Parser: Parser$1
};

/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */

var Parser = elenpi.Parser;
var r = elenpi.Rule.initializer;
var b = babelute$2.init;
var replaceSingleString = /\\'/g;
var replaceDoubleString = /\\"/g;
var valuePrevisuMap = {
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
};
var rules = {
	//_____________________________________
	babelute: r.space().oneOrMore({
		rule: 'lexem',
		separator: r.terminal(/^\s*/),
		pushTo: function pushTo(env, parent, obj) {
			// Parser.counts.countLexem++;
			if (obj.lexicon && obj.lexicon !== env.currentLexicon) {
				// 'scoped' lexicon management
				if (parent.__swapped__) // we have already push something before (aka second (or more) lexicon change on same babelute)
					env.lexicons[env.lexicons.length - 1] = obj.lexicon;else env.lexicons.push(obj.lexicon); // push lexicon to scope
				env.currentLexicon = obj.lexicon;
				var newParent = b(obj.lexicon, env.asFirstLevel);
				newParent._lexems = parent._lexems;
				parent.__swapped__ = newParent;
			} else {
				// use current babelute lexicon
				parent = parent.__swapped__ || parent;
				getMethod(parent, obj.name).apply(parent, obj.args);
			}
		}
	}).done(function (env, babelute) {
		if (babelute.__swapped__) {
			// 'scoped' lexicon management :
			// one lexicon has been pushed from this babelute
			// so pop to parent lexicon
			env.lexicons.pop();
			env.currentLexicon = env.lexicons[env.lexicons.length - 1];
			delete babelute.__swapped__;
		}
	}).space(),

	lexem: r.oneOf(
	// lexem (aka: name(arg1, arg2, ...))
	r.terminal(/^([\w-_]+)\s*\(\s*/, function (env, obj, cap) {
		// lexem name + ' ( '
		obj.name = cap[1];
		obj.args = [];
	}).oneOf(r.terminal(/^\s*\)/), // end parenthesis

	r.oneOrMore({ // arguments
		rule: 'value',
		separator: r.terminal(/^\s*,\s*/),
		pushTo: function pushTo(env, parent, obj) {
			// Parser.counts.countLexemValues++;
			parent.args.push(obj.value);
		}
	}).terminal(/^\s*\)/) // end parenthesis
	),

	// lexicon selector (aka #lexicon:)
	r.terminal(/^#([\w-_]+):/, function (env, obj, cap) {
		// '@' + lexicon name + ':'
		obj.lexicon = cap[1];
	})),

	/***********
  * VALUES
  ***********/
	value: r.done(function (env, obj) {
		if (!env.string.length) {
			env.error = true;
			return;
		}
		// shortcut with first char previsu through valueMap
		Parser.exec(valuePrevisuMap[env.string[0]] || 'wordValue', obj, env);
	}),

	number: r.terminal(/^[0-9]+(\.[0-9]+)?/, function (env, obj, cap) {
		obj.value = cap[1] ? parseFloat(cap[0] + cap[1], 10) : parseInt(cap[0], 10);
	}),
	singlestring: r.terminal(/^'((?:\\'|[^'])*)'/, function (env, obj, cap) {
		obj.value = cap[1].replace(replaceSingleString, "'");
	}),
	doublestring: r.terminal(/^"((?:\\"|[^"])*)"/, function (env, obj, cap) {
		obj.value = cap[1].replace(replaceDoubleString, '"');
	}),

	wordValue: r.oneOf(
	// true|false|null|undefined|NaN|Infinity
	r.terminal(/^(?:true|false|null|undefined|NaN|Infinity)/, function (env, obj, cap) {
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
		set: function set(env, parent, obj) {
			if (env.acceptFunctions) // todo : add warning when not allowed but present
				parent.value = Function.apply(null, obj.args.concat(obj.block));
		}
	}),
	// babelutes
	r.one({
		rule: 'babelute',
		as: function as(env) {
			return b(env.currentLexicon, env.asFirstLevel);
		},
		set: function set(env, parent, obj) {
			parent.value = obj;
		}
	})),

	object: r.one({
		rule: r.terminal(/^\{\s*/) // start bracket
		.zeroOrMore({ // properties
			rule: r
			// key
			.terminal(/^([\w-_]+)|"([^"]*)"|'([^']*)'/, function (env, obj, cap) {
				obj.key = cap[1];
			}).terminal(/^\s*:\s*/)
			// value
			.one('value'),
			separator: r.terminal(/^\s*,\s*/),
			pushTo: function pushTo(env, parent, obj) {
				parent[obj.key] = obj.value;
			}
		}).terminal(/^\s*\}/), // end bracket

		set: function set(env, parent, obj) {
			parent.value = obj;
		}
	}),

	array: r.one({
		rule: r.terminal(/^\[\s*/) // start square bracket
		.zeroOrMore({ // items
			rule: 'value',
			separator: r.terminal(/^\s*,\s*/),
			pushTo: function pushTo(env, parent, obj) {
				parent.push(obj.value);
			}
		}).terminal(/^\s*\]/), // end square bracket

		as: function as() {
			return [];
		},
		set: function set(env, parent, obj) {
			parent.value = obj;
		}
	}),

	function: r.terminal(/^function\s*\(\s*/, function (env, obj) {
		obj.args = [];
		obj.block = '';
	}).zeroOrMore({ // arguments key
		rule: r.terminal(/^[\w-_]+/, 'key'),
		separator: r.terminal(/^\s*,\s*/),
		pushTo: function pushTo(env, parent, obj) {
			parent.args.push(obj.key);
		}
	}).terminal(/^\s*\)\s*\{/).one('scopeBlock').done(function (env, obj) {
		// remove last uneeded '}' in catched block (it's there for inner-blocks recursion)
		obj.block = obj.block.substring(0, obj.block.length - 1);
	}),

	scopeBlock: r // function scope block (after first '{')
	.oneOf(
	// inner block recursion
	r.terminal(/^[^\{\}]*\{/, function (env, obj, cap) {
		obj.block += cap[0];
	}).oneOrMore('scopeBlock'),

	// end block 
	r.terminal(/^[^\}]*\}/, function (env, obj, cap) {
		obj.block += cap[0];
	}))
};
var parser = new Parser(rules);

/**
 * parse UUS string to babelute instance
 * @param  {string} string the UUS string to parse
 * @param  {Object={}} opt    options
 * @return {Babelute}      the deserialized babelute instance
 * @public
 */
function fromUUS(string) {
	var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var env = {};
	Object.assign(env, opt);
	env.lexicons = [opt.mainLexic];
	env.currentLexicon = opt.mainLexic || null;
	return parser.parse(string, 'babelute', b(opt.mainLexic, env.asFirstLevel), env);
}

function getMethod(parent, name) {
	var method = parent[name];
	if (!method) throw new Error('Babelute : no lexem found in current lexicon (' + (parent.__babelute__ || 'default') + ') with :' + name);
	return method;
}



//

/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016 Gilles Coomans
 */
// serializer to Babelute DSL
// Babelute DSL parser
var babelute = babelute$2;

babelute.fromUUS = fromUUS;
babelute.toUUS = toUUS;

export default babelute;
//# sourceMappingURL=index.mjs.map
