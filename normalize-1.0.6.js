/*! Normalize-1.0.6.js: A collection of polyfills to standardize your JavaScript browser environment.
   Examples: console.log, Array.of(), String.prototype.trim(), Array.forEach(), String.fromCodePoint(), etc.

   Yes, we know that you're a genius whiz-kid who writes all your own code from scratch. But sometimes, you'd rather not to. Deadlines, time constraints, or 
   a subject too complicated or time-consuming to understand properly without serious effort, and you'd rather not spend that time, especially if someone else already has.
   So you decide (or are forced to) use a third-party library.
   
   But third-party code can be unreliable. Strange, hard-to-debug errors, third-party dependencies (with dependencies of their own). Many times you end up just 
   writing the code you needed anyway. What if it could be avoided? Perhaps it can.

   normalize.js will help your third party code not break.
*/

/// -------------------------------------------------------- General purpose polyfills ---------------------------------------------------------------

// Many properties are read-only, and assigning a value to them if they're already defined returns a TypeError in strict mode,
// so we have to be careful to only define them if they aren't already defined.

"use strict";
"version 1.0.6";

// If undefined isnt undefined, undefined can be redefined. | Polyfill undefined for anyone stupid enough to modify this
;(function(u) { if (undefined !== u) {
	try {
		Object.defineProperty(window, 'undefined', { value: u, enumerable: false, writable: false, configurable: false });
	}
	catch (e) { // Object.defineProperty isn't supported
		window['undefined'] = u;
	}
}})();

/* Element isn't defined in IE6/7 and other legacy browsers, and unlike for Node, third-party code usually doesn't check for that.
   We aren't bothering to truly polyfill IE since it's so obsolete, but we do want any boilerplate code that runs to at least not throw any errors.
*/

// Prevent IE from throwing on Element accessors.
if (typeof Element === 'undefined') { window.Element = function(){}; }
if (typeof CharacterData === 'undefined') { window.CharacterData = function(){}; }
if (typeof DocumentType === 'undefined') { window.DocumentType = function(){}; }


// Console-polyfill. MIT license. | https://github.com/paulmillr/console-polyfill | Makes it safe to do console.log() always.

;(function(w) { if (!w.console) { w.console = {} }
	var con = w.console, prop, method, dummy = function(){}, properties = ['memory'];
	var methods = ('assert|clear|count|debug|dir|dirxml|error|exception|group|' +
	  'groupCollapsed|groupEnd|info|log|markTimeline|profile|profiles|profileEnd|' +
	  'show|table|time|timeEnd|timeline|timelineEnd|timeStamp|trace|warn|timeLog|trace').split('|');

	while (prop = properties.pop()) { if (!con[prop]) { con[prop] = {} }}
	while (method = methods.pop()) { if (!con[method]) { con[method] = dummy }}

	// Using `this` for web workers & supports Browserify / Webpack.
})(typeof window === 'undefined' ? this : window);


// DOMContentLoaded Event polyfill | https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
// https://github.com/Kithraya/DOMContentLoaded v1.2.6 | MIT License (attribution isn't necessary, but appreciated <3)

DOMContentLoaded.version = "1.2.6.5";

function DOMContentLoaded() { "use strict";

    var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
    var alreadyRun, funcs = arguments; // for use in the idempotent function ready, defined later.

    function microtime() { return + new Date() } // new Date().valueOf()

    // detect IE <11 via conditional compilation
    var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*\/")() ); 

    if (document.readyState === 'complete') { ready(null); return; }

    if (jscript_version < 9) { doIEScrollCheck(); return; }

    if (document[ael]) { document[ael]("DOMContentLoaded", ready, false); window[ael]("load", ready, false); } else
    if (aev in window) { window[aev]('onload', ready); }
    else { addOnload(ready); }

    // to add a function to window.onload queue
    function addOnload(fn) { var prev = window.onload;

        if (typeof addOnload.queue !== 'object') { addOnload.queue = [];
            if (typeof prev === 'function') { addOnload.queue.push( prev ); }
        }
        if (typeof fn === 'function') { addOnload.queue.push(fn) }

        window.onload = function() { for (var i=0; i < addOnload.queue.length; i++) { addOnload.queue[i]() } };
    }

    // to remove a function from addOnload.queue
    function dequeueOnload(fn, eraseAllMatching) {
        if (typeof addOnload.queue === 'object') {
            for (var i = addOnload.queue.length-1; i >= 0; i--) {
                if (fn === addOnload.queue[i]) {
                    addOnload.queue.splice(i,1); if (!eraseAllMatching) {break}
                }
            }
        }
    }

    // idempotent event handler function
    function ready(time) { 
	if (alreadyRun) {return} alreadyRun = true;
        var readyTime = microtime();
	    
	detach();

        for (var i=0; i < funcs.length; i++) { var func = funcs[i];

            if (typeof func === 'function') {
                func.call(document, {
                  'readyTime': (time === null ? null : readyTime),
                  'funcExecuteTime': microtime(),
                  'currentFunction': func
                });
            }
        }
    }			     
			    
    // remove event handlers
    function detach() {
        if (document[rel]) { document[rel]("DOMContentLoaded", ready); window[rel]("load", ready); } else
        if (dev in window) { window[dev]("onload", ready); }
        else { dequeueOnload(ready) }
    }

    // for IE<9 poll document.documentElement.doScroll, no further actions are needed.
    function doIEScrollCheck() { // for use in IE < 9 only.
        if ( window.frameElement ) { try { window.attachEvent("onload", ready); } catch (e) { } return; }
        try {
            document.documentElement.doScroll('left');
        } catch(error) {
            setTimeout(function() {
                (document.readyState === 'complete') ? ready() : doIEScrollCheck();
            }, 50);
            return;
        }
        ready();
    }
}


///------------------------------------------------------- Element / DOM manipulation polyfills -------------------------------------------------------------

Element.prototype.remove || (Element.prototype.remove = function() {
	if (this.parentNode) { this.parentNode.removeChild(this) }
});

/// ------------------------------------------------------ Window, Document property polyfills --------------------------------------------------------------

if (!window['isNaN']) { window.isNaN = function(v) { return +v !== +v } }
if (!document['head']) {
	document.head = ('getElementsByTagName' in document) ? document.getElementsByTagName('head')[0] : document.all[1];
}

// function to()

function compare(f1, f2, arr) {
	if (typeof f1 !== 'function' || typeof f2 !== 'function') { return }
	for (var i=0;i<arr.length;i++) {
		console.log("F1: " + f1.name , f1(arr[i]), "F2:" + f2.name, f2(arr[i]))
	}
}

function define(obj, prop, val, ewc) {
	if (!(prop in obj)) { // only if prop isn't defined
		try {
			Object.defineProperty(obj, prop, {
				value: val,
				enumerable: false,
				writable: false,
				configurable: false
			});
		} catch (e) { // Object.defineProperty isn't supported
			obj[prop] = val;
		}
  }
}


///------------------------------------------------------- Number property polyfills --------------------------------------------------------------

define(Number, 'EPSILON', Math.pow(2, -52));
define(Number, 'MAX_SAFE_INTEGER', 9007199254740991);
define(Number, 'MIN_SAFE_INTEGER', -9007199254740991);
define(Number, 'POSITIVE_INFINITY', Infinity);
define(Number, 'NEGATIVE_INFINITY', -Infinity);
define(Number, 'MAX_VALUE', 1.7976931348623157e+308);
define(Number, 'MIN_VALUE', 5e-324);
define(Number, 'NaN', NaN, [0,0,0]); // { ewc: [0, 0, 0]}

if (!Number['isNaN']) { Number.isNaN = function(i) { return typeof i === 'number' && (i !== i); }}
if (!Number['isFinite']) { Number.isFinite = function(v) { return typeof v === 'number' && isFinite(v) }}
if (!Number['isInteger']) { Number.isInteger = function(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }}
if (!Number['isSafeInteger']) { Number.isSafeInteger = function(v) { return Number.isInteger(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER }}
if (!Number['parseInt']) { Number.parseInt = parseInt }
if (!Number['pareFloat']) { Number.parseFloat = parseFloat }

// Number['isNaN'] || ( Number.isNaN = function(i) { return typeof i === 'number' && (i !== i); } );

// if (!Number['isNumeric']) { Number.isNumeric = function(v) { } }

/// ------------------------------------------------------ String property polyfills ---------------------------------------------------------------

// String.prototype.trim() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill

if (!String.prototype['trim']) {
	String.prototype['trim'] = function() { return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); };
}

// String.prototype.includes() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill

if (!String.prototype['includes']) {
  String.prototype.includes = function(search, start) {
    'use strict';

    if (search instanceof RegExp) { throw TypeError('first argument must not be a RegExp'); }
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}


// String.fromCodePoint() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint

if (!String['fromCodePoint']) { (function(stringFromCharCode) {
    var fromCodePoint = function(_) {
      var codeUnits = [], codeLen = 0, result = "";
      for (var index=0, len = arguments.length; index !== len; ++index) {
        var codePoint = +arguments[index];
        // correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
        // The surrounding `!(...)` is required to correctly handle `NaN` cases
        // The (codePoint>>>0) === codePoint clause handles decimals and negatives
        if (!(codePoint < 0x10FFFF && (codePoint>>>0) === codePoint)) {throw RangeError("Invalid code point: " + codePoint)}
        if (codePoint <= 0xFFFF) { // BMP code point
          codeLen = codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          codePoint -= 0x10000;
          codeLen = codeUnits.push(
            (codePoint >> 10) + 0xD800,  // highSurrogate
            (codePoint % 0x400) + 0xDC00 // lowSurrogate
          );
        }
        if (codeLen >= 0x3fff) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result + stringFromCharCode.apply(null, codeUnits);
    };
    try { // IE 8 only supports `Object.defineProperty` on DOM elements
      Object.defineProperty(String, "fromCodePoint", {
        "value": fromCodePoint, "configurable": true, "writable": true
      });
    } catch(e) {
      String.fromCodePoint = fromCodePoint;
    }
  }(String.fromCharCode));
}


// String.prototype.codePointAt() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt 
// https://mths.be/codepointat v0.2.0 by @mathias

if (!String.prototype['codePointAt']) { (function() {
    'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
    var defineProperty = (function() {
      // IE 8 only supports `Object.defineProperty` on DOM elements
      try {
	var object = {}, $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(e) {}
      return result;
    }());
    var codePointAt = function(position) {
      if (this == null) {
        throw TypeError('this is null or not defined!');
      }
      var string = String(this);
      var size = string.length;
      // `ToInteger`
      var index = position ? Number(position) : 0;
      if (index != index) { // better `isNaN`
        index = 0;
      }
      // Account for out-of-bounds indices:
      if (index < 0 || index >= size) {
        return undefined;
      }
      // Get the first code unit
      var first = string.charCodeAt(index);
      var second;
      if ( // check if it’s the start of a surrogate pair
        first >= 0xD800 && first <= 0xDBFF && // high surrogate
        size > index + 1 // there is a next code unit
      ) {
        second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
          // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
      }
      return first;
    };
    if (defineProperty) {
      defineProperty(String.prototype, 'codePointAt', {
        'value': codePointAt,
        'configurable': true,
        'writable': true
      });
    } else {
      String.prototype.codePointAt = codePointAt;
    }
  }());
}


/// --------------------------------------------------------------- Array property polyfills ---------------------------------------------------------------- //

// Array.isArray() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array['isArray']) { Array.isArray = function(arg) { return Object.prototype.toString.call(arg) === '[object Array]' } }

// Array.of() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
if (!Array['of']) { Array.of = function() { return Array.prototype.slice.call(arguments) } }


// Array.prototype.forEach() polyfill | Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18

if (!Array.prototype['forEach']) {
	Array.prototype.forEach = function(callback, thisArg) {

	  if (this == null) { throw new TypeError('this is null or undefined'); }

	  var T, k = 0;
	  var O = Object(this);
		  var len = O.length >>> 0;

	  if (typeof callback !== "function") { throw new TypeError(callback + ' is not a function'); }
	  if (arguments.length > 1) { T = thisArg; }

	  while (k < len) { var kValue;
	    if (k in O) { kValue = O[k]; callback.call(T, kValue, k, O); }
	    k++;
	  }
  };
}


// Array.prototype.every() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every

if (!Array.prototype['every']) {
  Array.prototype.every = function(callbackfn, thisArg) {
    'use strict';
    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the this
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method
    //    of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== 'function' && Object.prototype.toString.call(callbackfn) !== '[object Function]') {
      throw new TypeError();
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        var testResult;
        // i. Let kValue be the result of calling the Get internal method
        //    of O with argument Pk.
        kValue = O[k];

        // ii. Let testResult be the result of calling the Call internal method
        // of callbackfn with T as the this value if T is not undefined
        // else is the result of calling callbackfn
        // and argument list containing kValue, k, and O.
        if(T) testResult = callbackfn.call(T, kValue, k, O);
        else testResult = callbackfn(kValue,k,O)

        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
}


// Array.prototype.filter() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

if (!Array.prototype['filter']){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) ) { throw new TypeError() }

    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;

    var kValue;
    if (thisArg === undefined){
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          kValue = t[i]; // in case t is changed in callback
          if (func(t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }
    else{
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          kValue = t[i];
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }

    res.length = c; // shrink down array to proper size
    return res;
  };
}


// Array.prototype.indexOf() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// Production steps of ECMA-262, Edition 5, 15.4.4.14 | Reference: http://es5.github.io/#x15.4.4.14

if (!Array.prototype['indexOf']) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    "use strict";
    var k;

    if (this == null) { throw new TypeError('"this" is null or not defined') }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) { return -1 }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = fromIndex | 0;

    // 6. If n >= len, return -1.
    if (n >= len) { return -1 }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    for (; k < len; k++) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement)
        return k;
    }
    return -1;
  };
}


// Array.prototype.lastIndexOf() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
// Production steps of ECMA-262, Edition 5, 15.4.4.15 | Reference: http://es5.github.io/#x15.4.4.15

if (!Array.prototype['lastIndexOf']) {
  Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
    'use strict';

    if (this == null) { throw new TypeError('this is null or not defined'); }

    var n, k, t = Object(this), len = t.length >>> 0;
    if (len === 0) { return -1 }

    n = len - 1;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) {
        n = 0;
      }
      else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// NodeList.prototype.forEach() polyfill | https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if (window.NodeList && !NodeList.prototype.forEach) { NodeList.prototype.forEach = Array.prototype.forEach; }


// Array.from() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Production steps of ECMA-262, Edition 6, 22.1.2.1

/* Polyfill Notes: This algorithm is exactly as specified in ECMA-262 6th Edition
	(assuming Object and TypeError have their original values and that callback.call()
	evaluates to the original value of Function.prototype.call()).

	In addition, since true iterables cannot be polyfilled,
	this implementation does not support generic iterables as defined in the 6th Edition of ECMA-262.
*/

if (!Array.from) { // TODO: check Array.from still works, due to having had to remove NFEs
    Array.from = (function () {
        var symbolIterator;
        try {
            symbolIterator = Symbol.iterator
                ? Symbol.iterator
                : 'Symbol(Symbol.iterator)';
        } catch (e) {
            symbolIterator = 'Symbol(Symbol.iterator)';
        }

        var toStr = Object.prototype.toString;
        var isCallable = function(fn) {
            return (
                typeof fn === 'function' ||
                toStr.call(fn) === '[object Function]'
            );
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) {return 0}
            if (number === 0 || !isFinite(number)) {return number}
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        var setGetItemHandler = function(isIterator, items) {
            var iterator = isIterator && items[symbolIterator]();
            return function(k) {
                return isIterator ? iterator.next() : items[k];
            };
        };

        var getArray = function(
            T,
            A,
            len,
            getItem,
            isIterator,
            mapFn
        ) {
            // 16. Let k be 0.
            var k = 0;

            // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
            while (k < len || isIterator) {
                var item = getItem(k);
                var kValue = isIterator ? item.value : item;

                if (isIterator && item.done) {
                    return A;
                } else {
                    if (mapFn) {
                        A[k] =
                            typeof T === 'undefined'
                                ? mapFn(kValue, k)
                                : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                }
                k += 1;
            }

            if (isIterator) {
                throw new TypeError(
                    'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
                );
            } else {
                A.length = len;
            }

            return A;
        };

        // The length property of the from method is 1.
        return function (arrayLikeOrIterator /*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLikeOrIterator).
            var items = Object(arrayLikeOrIterator);
            var isIterator = isCallable(items[symbolIterator]);

            // 3. ReturnIfAbrupt(items).
            if (arrayLikeOrIterator == null && !isIterator) {
                throw new TypeError(
                    'Array.from requires an array-like object or iterator - not null or undefined'
                );
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError(
                        'Array.from: when provided, the second argument must be a function'
                    );
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            return getArray(
                T,
                A,
                len,
                setGetItemHandler(isIterator, items),
                isIterator,
                mapFn
            );
        };
    })();
}

//function isElement(element) { return element instanceof Element || element instanceof HTMLDocument; }

/*
	var hasTouchScreen = false;
if ("maxTouchPoints" in navigator) {
    hasTouchScreen = (navigator.maxTouchPoints > 0);
} else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = (navigator.msMaxTouchPoints > 0);
} else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
    } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}
if (hasTouchScreen) {}

*/
