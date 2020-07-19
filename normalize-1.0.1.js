// Collection of Polyfills to standardize the javascript browser environment. 
// Examples: console.log, Array.of(), String.prototype.trim(), Array.isArray(), etc.

// strict mode does not allow assignment of read only property 'head'
if (!document.head) { document.head = document.getElementsByTagName('head')[0]; }

/*! Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill Makes it safe to do console.log() always. */

(function(w) { 'use strict'; 
	if (!w.console) { w.console = {} }
	
	var con = w.console, 
	    prop, method, 
	    dummy = function() {},
	    properties = ['memory'],
	    methods = ('assert clear count debug dir dirxml error exception group ' +
		'groupCollapsed groupEnd info log markTimeline profile profiles profileEnd ' +
		'show table time timeEnd timeline timelineEnd timeStamp trace warn timeLog trace').split(' ');
		
	while (prop = properties.pop()) { if (!con[prop]) { con[prop] = {}; } }
	while (method = methods.pop()) { if (!con[method]) { con[method] = dummy; } }
	// Using `this` for web workers & supports Browserify / Webpack.
	
})(typeof window === 'undefined' ? this : window);


// NUMBER properties	
// many are read-only, and assigning a value to them if they are already defined returns a TypeError in strict mode, 
// so we either use try catch for X = X || define x, or if blocks

///-------------------- Number property polyfills ------------------------

if (!Number['EPSILON']) { Number.EPSILON = Math.pow(2, -52); }
if (!Number['MAX_SAFE_INTEGER']) { Number.MAX_SAFE_INTEGER = 9007199254740991; }
if (!Number['MIN_SAFE_INTEGER']) { Number.MIN_SAFE_INTEGER = -9007199254740991; }
if (!Number['isNaN']) { Number.isNaN = function(i) { return typeof i === 'number' && i !== i; } }
if (!Number['isInteger']) { Number.isInteger = function(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; } }
if (!Number['isSafeInteger']) { Number.isSafeInteger = function(v) { return Number.isInteger(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER } }
if (!Number['parseInt']) { Number.parseInt = window.parseInt }


/// ------------------- String property polyfills ------------------------
/**
 * String.prototype.trim() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
 */

if (!String.prototype.trim) {
    String.prototype['trim'] = function () { return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); };
}

if (!String.prototype.includes) {
  String.prototype['includes'] = function(search, start) { 'use strict';
                                                          
    if (search instanceof RegExp) { throw TypeError('first argument must not be a RegExp'); } 
    if (start === undefined) { start = 0; }                                                      
    return this.indexOf(search, start) !== -1;
  };
}
