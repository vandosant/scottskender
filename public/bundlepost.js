/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var yo = __webpack_require__(172);
	var Posts = __webpack_require__(170);

	Posts.load().then(function (posts) {
	  console.log(posts);
	});

/***/ },

/***/ 170:
/***/ function(module, exports) {

	'use strict';

	function load() {
	    return fetch('/api/posts').then(function (res) {
	        if (res.status === 200) {
	            return res.json();
	        }
	    });
	};

	var api = {
	    load: load
	};

	module.exports = api;

/***/ },

/***/ 172:
/***/ function(module, exports, __webpack_require__) {

	var bel = __webpack_require__(173) // turns template tag into DOM elements
	var morphdom = __webpack_require__(178) // efficiently diffs + morphs two DOM elements
	var defaultEvents = __webpack_require__(179) // default events to be copied when dom elements update

	module.exports = bel

	// TODO move this + defaultEvents to a new module once we receive more feedback
	module.exports.update = function (fromNode, toNode, opts) {
	  if (!opts) opts = {}
	  if (opts.events !== false) {
	    if (!opts.onBeforeMorphEl) opts.onBeforeMorphEl = copier
	  }

	  return morphdom(fromNode, toNode, opts)

	  // morphdom only copies attributes. we decided we also wanted to copy events
	  // that can be set via attributes
	  function copier (f, t) {
	    // copy events:
	    var events = opts.events || defaultEvents
	    for (var i = 0; i < events.length; i++) {
	      var ev = events[i]
	      if (t[ev]) { // if new element has a whitelisted attribute
	        f[ev] = t[ev] // update existing element
	      } else if (f[ev]) { // if existing element has it and new one doesnt
	        f[ev] = undefined // remove it from existing element
	      }
	    }
	    // copy values for form elements
	    if (f.nodeName === 'INPUT' || f.nodeName === 'TEXTAREA' || f.nodeName === 'SELECT') {
	      if (t.getAttribute('value') === null) t.value = f.value
	    }
	  }
	}


/***/ },

/***/ 173:
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(174)
	var hyperx = __webpack_require__(176)

	var SVGNS = 'http://www.w3.org/2000/svg'
	var BOOL_PROPS = {
	  autofocus: 1,
	  checked: 1,
	  defaultchecked: 1,
	  disabled: 1,
	  formnovalidate: 1,
	  indeterminate: 1,
	  readonly: 1,
	  required: 1,
	  willvalidate: 1
	}
	var SVG_TAGS = [
	  'svg',
	  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
	  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
	  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
	  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
	  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
	  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
	  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
	  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
	  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
	  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
	  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
	  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
	  'tspan', 'use', 'view', 'vkern'
	]

	function belCreateElement (tag, props, children) {
	  var el

	  // If an svg tag, it needs a namespace
	  if (SVG_TAGS.indexOf(tag) !== -1) {
	    props.namespace = SVGNS
	  }

	  // If we are using a namespace
	  var ns = false
	  if (props.namespace) {
	    ns = props.namespace
	    delete props.namespace
	  }

	  // Create the element
	  if (ns) {
	    el = document.createElementNS(ns, tag)
	  } else {
	    el = document.createElement(tag)
	  }

	  // Create the properties
	  for (var p in props) {
	    if (props.hasOwnProperty(p)) {
	      var key = p.toLowerCase()
	      var val = props[p]
	      // Normalize className
	      if (key === 'classname') {
	        key = 'class'
	        p = 'class'
	      }
	      // If a property is boolean, set itself to the key
	      if (BOOL_PROPS[key]) {
	        if (val === 'true') val = key
	        else if (val === 'false') continue
	      }
	      // If a property prefers being set directly vs setAttribute
	      if (key.slice(0, 2) === 'on') {
	        el[p] = val
	      } else {
	        if (ns) {
	          el.setAttributeNS(null, p, val)
	        } else {
	          el.setAttribute(p, val)
	        }
	      }
	    }
	  }

	  function appendChild (childs) {
	    if (!Array.isArray(childs)) return
	    for (var i = 0; i < childs.length; i++) {
	      var node = childs[i]
	      if (Array.isArray(node)) {
	        appendChild(node)
	        continue
	      }

	      if (typeof node === 'number' ||
	        typeof node === 'boolean' ||
	        node instanceof Date ||
	        node instanceof RegExp) {
	        node = node.toString()
	      }

	      if (typeof node === 'string') {
	        if (el.lastChild && el.lastChild.nodeName === '#text') {
	          el.lastChild.nodeValue += node
	          continue
	        }
	        node = document.createTextNode(node)
	      }

	      if (node && node.nodeType) {
	        el.appendChild(node)
	      }
	    }
	  }
	  appendChild(children)

	  return el
	}

	module.exports = hyperx(belCreateElement)
	module.exports.createElement = belCreateElement


/***/ },

/***/ 174:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __webpack_require__(175);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 175:
/***/ function(module, exports) {

	/* (ignored) */

/***/ },

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	var attrToProp = __webpack_require__(177)

	var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
	var ATTR_KEY = 5, ATTR_KEY_W = 6
	var ATTR_VALUE_W = 7, ATTR_VALUE = 8
	var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
	var ATTR_EQ = 11, ATTR_BREAK = 12

	module.exports = function (h, opts) {
	  h = attrToProp(h)
	  if (!opts) opts = {}
	  var concat = opts.concat || function (a, b) {
	    return String(a) + String(b)
	  }

	  return function (strings) {
	    var state = TEXT, reg = ''
	    var arglen = arguments.length
	    var parts = []

	    for (var i = 0; i < strings.length; i++) {
	      if (i < arglen - 1) {
	        var arg = arguments[i+1]
	        var p = parse(strings[i])
	        var xstate = state
	        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
	        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
	        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
	        if (xstate === ATTR) xstate = ATTR_KEY
	        p.push([ VAR, xstate, arg ])
	        parts.push.apply(parts, p)
	      } else parts.push.apply(parts, parse(strings[i]))
	    }

	    var tree = [null,{},[]]
	    var stack = [[tree,-1]]
	    for (var i = 0; i < parts.length; i++) {
	      var cur = stack[stack.length-1][0]
	      var p = parts[i], s = p[0]
	      if (s === OPEN && /^\//.test(p[1])) {
	        var ix = stack[stack.length-1][1]
	        if (stack.length > 1) {
	          stack.pop()
	          stack[stack.length-1][0][2][ix] = h(
	            cur[0], cur[1], cur[2].length ? cur[2] : undefined
	          )
	        }
	      } else if (s === OPEN) {
	        var c = [p[1],{},[]]
	        cur[2].push(c)
	        stack.push([c,cur[2].length-1])
	      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
	        var key = ''
	        var copyKey
	        for (; i < parts.length; i++) {
	          if (parts[i][0] === ATTR_KEY) {
	            key = concat(key, parts[i][1])
	          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
	            if (typeof parts[i][2] === 'object' && !key) {
	              for (copyKey in parts[i][2]) {
	                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
	                  cur[1][copyKey] = parts[i][2][copyKey]
	                }
	              }
	            } else {
	              key = concat(key, parts[i][2])
	            }
	          } else break
	        }
	        if (parts[i][0] === ATTR_EQ) i++
	        var j = i
	        for (; i < parts.length; i++) {
	          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
	            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
	            else cur[1][key] = concat(cur[1][key], parts[i][1])
	          } else if (parts[i][0] === VAR
	          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
	            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
	            else cur[1][key] = concat(cur[1][key], parts[i][2])
	          } else {
	            if (key.length && !cur[1][key] && i === j
	            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
	              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
	              // empty string is falsy, not well behaved value in browser
	              cur[1][key] = key.toLowerCase()
	            }
	            break
	          }
	        }
	      } else if (s === ATTR_KEY) {
	        cur[1][p[1]] = true
	      } else if (s === VAR && p[1] === ATTR_KEY) {
	        cur[1][p[2]] = true
	      } else if (s === CLOSE) {
	        if (selfClosing(cur[0]) && stack.length) {
	          var ix = stack[stack.length-1][1]
	          stack.pop()
	          stack[stack.length-1][0][2][ix] = h(
	            cur[0], cur[1], cur[2].length ? cur[2] : undefined
	          )
	        }
	      } else if (s === VAR && p[1] === TEXT) {
	        if (p[2] === undefined || p[2] === null) p[2] = ''
	        else if (!p[2]) p[2] = concat('', p[2])
	        if (Array.isArray(p[2][0])) {
	          cur[2].push.apply(cur[2], p[2])
	        } else {
	          cur[2].push(p[2])
	        }
	      } else if (s === TEXT) {
	        cur[2].push(p[1])
	      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
	        // no-op
	      } else {
	        throw new Error('unhandled: ' + s)
	      }
	    }

	    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
	      tree[2].shift()
	    }

	    if (tree[2].length > 2
	    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
	      throw new Error(
	        'multiple root elements must be wrapped in an enclosing tag'
	      )
	    }
	    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
	    && Array.isArray(tree[2][0][2])) {
	      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
	    }
	    return tree[2][0]

	    function parse (str) {
	      var res = []
	      if (state === ATTR_VALUE_W) state = ATTR
	      for (var i = 0; i < str.length; i++) {
	        var c = str.charAt(i)
	        if (state === TEXT && c === '<') {
	          if (reg.length) res.push([TEXT, reg])
	          reg = ''
	          state = OPEN
	        } else if (c === '>' && !quot(state)) {
	          if (state === OPEN) {
	            res.push([OPEN,reg])
	          } else if (state === ATTR_KEY) {
	            res.push([ATTR_KEY,reg])
	          } else if (state === ATTR_VALUE && reg.length) {
	            res.push([ATTR_VALUE,reg])
	          }
	          res.push([CLOSE])
	          reg = ''
	          state = TEXT
	        } else if (state === TEXT) {
	          reg += c
	        } else if (state === OPEN && /\s/.test(c)) {
	          res.push([OPEN, reg])
	          reg = ''
	          state = ATTR
	        } else if (state === OPEN) {
	          reg += c
	        } else if (state === ATTR && /[\w-]/.test(c)) {
	          state = ATTR_KEY
	          reg = c
	        } else if (state === ATTR && /\s/.test(c)) {
	          if (reg.length) res.push([ATTR_KEY,reg])
	          res.push([ATTR_BREAK])
	        } else if (state === ATTR_KEY && /\s/.test(c)) {
	          res.push([ATTR_KEY,reg])
	          reg = ''
	          state = ATTR_KEY_W
	        } else if (state === ATTR_KEY && c === '=') {
	          res.push([ATTR_KEY,reg],[ATTR_EQ])
	          reg = ''
	          state = ATTR_VALUE_W
	        } else if (state === ATTR_KEY) {
	          reg += c
	        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
	          res.push([ATTR_EQ])
	          state = ATTR_VALUE_W
	        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
	          res.push([ATTR_BREAK])
	          if (/[\w-]/.test(c)) {
	            reg += c
	            state = ATTR_KEY
	          } else state = ATTR
	        } else if (state === ATTR_VALUE_W && c === '"') {
	          state = ATTR_VALUE_DQ
	        } else if (state === ATTR_VALUE_W && c === "'") {
	          state = ATTR_VALUE_SQ
	        } else if (state === ATTR_VALUE_DQ && c === '"') {
	          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
	          reg = ''
	          state = ATTR
	        } else if (state === ATTR_VALUE_SQ && c === "'") {
	          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
	          reg = ''
	          state = ATTR
	        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
	          state = ATTR_VALUE
	          i--
	        } else if (state === ATTR_VALUE && /\s/.test(c)) {
	          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
	          reg = ''
	          state = ATTR
	        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
	        || state === ATTR_VALUE_DQ) {
	          reg += c
	        }
	      }
	      if (state === TEXT && reg.length) {
	        res.push([TEXT,reg])
	        reg = ''
	      } else if (state === ATTR_VALUE && reg.length) {
	        res.push([ATTR_VALUE,reg])
	        reg = ''
	      } else if (state === ATTR_VALUE_DQ && reg.length) {
	        res.push([ATTR_VALUE,reg])
	        reg = ''
	      } else if (state === ATTR_VALUE_SQ && reg.length) {
	        res.push([ATTR_VALUE,reg])
	        reg = ''
	      } else if (state === ATTR_KEY) {
	        res.push([ATTR_KEY,reg])
	        reg = ''
	      }
	      return res
	    }
	  }

	  function strfn (x) {
	    if (typeof x === 'function') return x
	    else if (typeof x === 'string') return x
	    else if (x && typeof x === 'object') return x
	    else return concat('', x)
	  }
	}

	function quot (state) {
	  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
	}

	var hasOwn = Object.prototype.hasOwnProperty
	function has (obj, key) { return hasOwn.call(obj, key) }

	var closeRE = RegExp('^(' + [
	  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
	  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
	  'source', 'track', 'wbr',
	  // SVG TAGS
	  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
	  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
	  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
	  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
	  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
	  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
	  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
	  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
	  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
	  'vkern'
	].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
	function selfClosing (tag) { return closeRE.test(tag) }


/***/ },

/***/ 177:
/***/ function(module, exports) {

	module.exports = attributeToProperty

	var transform = {
	  'class': 'className',
	  'for': 'htmlFor',
	  'http-equiv': 'httpEquiv'
	}

	function attributeToProperty (h) {
	  return function (tagName, attrs, children) {
	    for (var attr in attrs) {
	      if (attr in transform) {
	        attrs[transform[attr]] = attrs[attr]
	        delete attrs[attr]
	      }
	    }
	    return h(tagName, attrs, children)
	  }
	}


/***/ },

/***/ 178:
/***/ function(module, exports) {

	// Create a range object for efficently rendering strings to elements.
	var range;

	var testEl = (typeof document !== 'undefined') ?
	    document.body || document.createElement('div') :
	    {};

	var XHTML = 'http://www.w3.org/1999/xhtml';
	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;
	var COMMENT_NODE = 8;

	// Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
	// (IE7+ support) <=IE7 does not support el.hasAttribute(name)
	var hasAttributeNS;

	if (testEl.hasAttributeNS) {
	    hasAttributeNS = function(el, namespaceURI, name) {
	        return el.hasAttributeNS(namespaceURI, name);
	    };
	} else if (testEl.hasAttribute) {
	    hasAttributeNS = function(el, namespaceURI, name) {
	        return el.hasAttribute(name);
	    };
	} else {
	    hasAttributeNS = function(el, namespaceURI, name) {
	        return !!el.getAttributeNode(name);
	    };
	}

	function empty(o) {
	    for (var k in o) {
	        if (o.hasOwnProperty(k)) {
	            return false;
	        }
	    }
	    return true;
	}

	function toElement(str) {
	    if (!range && document.createRange) {
	        range = document.createRange();
	        range.selectNode(document.body);
	    }

	    var fragment;
	    if (range && range.createContextualFragment) {
	        fragment = range.createContextualFragment(str);
	    } else {
	        fragment = document.createElement('body');
	        fragment.innerHTML = str;
	    }
	    return fragment.childNodes[0];
	}

	var specialElHandlers = {
	    /**
	     * Needed for IE. Apparently IE doesn't think that "selected" is an
	     * attribute when reading over the attributes using selectEl.attributes
	     */
	    OPTION: function(fromEl, toEl) {
	        fromEl.selected = toEl.selected;
	        if (fromEl.selected) {
	            fromEl.setAttribute('selected', '');
	        } else {
	            fromEl.removeAttribute('selected', '');
	        }
	    },
	    /**
	     * The "value" attribute is special for the <input> element since it sets
	     * the initial value. Changing the "value" attribute without changing the
	     * "value" property will have no effect since it is only used to the set the
	     * initial value.  Similar for the "checked" attribute, and "disabled".
	     */
	    INPUT: function(fromEl, toEl) {
	        fromEl.checked = toEl.checked;
	        if (fromEl.checked) {
	            fromEl.setAttribute('checked', '');
	        } else {
	            fromEl.removeAttribute('checked');
	        }

	        if (fromEl.value !== toEl.value) {
	            fromEl.value = toEl.value;
	        }

	        if (!hasAttributeNS(toEl, null, 'value')) {
	            fromEl.removeAttribute('value');
	        }

	        fromEl.disabled = toEl.disabled;
	        if (fromEl.disabled) {
	            fromEl.setAttribute('disabled', '');
	        } else {
	            fromEl.removeAttribute('disabled');
	        }
	    },

	    TEXTAREA: function(fromEl, toEl) {
	        var newValue = toEl.value;
	        if (fromEl.value !== newValue) {
	            fromEl.value = newValue;
	        }

	        if (fromEl.firstChild) {
	            fromEl.firstChild.nodeValue = newValue;
	        }
	    }
	};

	function noop() {}

	/**
	 * Returns true if two node's names and namespace URIs are the same.
	 *
	 * @param {Element} a
	 * @param {Element} b
	 * @return {boolean}
	 */
	var compareNodeNames = function(a, b) {
	    return a.nodeName === b.nodeName &&
	           a.namespaceURI === b.namespaceURI;
	};

	/**
	 * Create an element, optionally with a known namespace URI.
	 *
	 * @param {string} name the element name, e.g. 'div' or 'svg'
	 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
	 * its `xmlns` attribute or its inferred namespace.
	 *
	 * @return {Element}
	 */
	function createElementNS(name, namespaceURI) {
	    return !namespaceURI || namespaceURI === XHTML ?
	        document.createElement(name) :
	        document.createElementNS(namespaceURI, name);
	}

	/**
	 * Loop over all of the attributes on the target node and make sure the original
	 * DOM node has the same attributes. If an attribute found on the original node
	 * is not on the new node then remove it from the original node.
	 *
	 * @param  {Element} fromNode
	 * @param  {Element} toNode
	 */
	function morphAttrs(fromNode, toNode) {
	    var attrs = toNode.attributes;
	    var i;
	    var attr;
	    var attrName;
	    var attrNamespaceURI;
	    var attrValue;
	    var fromValue;

	    for (i = attrs.length - 1; i >= 0; i--) {
	        attr = attrs[i];
	        attrName = attr.name;
	        attrValue = attr.value;
	        attrNamespaceURI = attr.namespaceURI;

	        if (attrNamespaceURI) {
	            attrName = attr.localName || attrName;
	            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
	        } else {
	            fromValue = fromNode.getAttribute(attrName);
	        }

	        if (fromValue !== attrValue) {
	            if (attrNamespaceURI) {
	                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
	            } else {
	                fromNode.setAttribute(attrName, attrValue);
	            }
	        }
	    }

	    // Remove any extra attributes found on the original DOM element that
	    // weren't found on the target element.
	    attrs = fromNode.attributes;

	    for (i = attrs.length - 1; i >= 0; i--) {
	        attr = attrs[i];
	        if (attr.specified !== false) {
	            attrName = attr.name;
	            attrNamespaceURI = attr.namespaceURI;

	            if (!hasAttributeNS(toNode, attrNamespaceURI, attrNamespaceURI ? attrName = attr.localName || attrName : attrName)) {
	                fromNode.removeAttributeNode(attr);
	            }
	        }
	    }
	}

	/**
	 * Copies the children of one DOM element to another DOM element
	 */
	function moveChildren(fromEl, toEl) {
	    var curChild = fromEl.firstChild;
	    while (curChild) {
	        var nextChild = curChild.nextSibling;
	        toEl.appendChild(curChild);
	        curChild = nextChild;
	    }
	    return toEl;
	}

	function defaultGetNodeKey(node) {
	    return node.id;
	}

	function morphdom(fromNode, toNode, options) {
	    if (!options) {
	        options = {};
	    }

	    if (typeof toNode === 'string') {
	        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
	            var toNodeHtml = toNode;
	            toNode = document.createElement('html');
	            toNode.innerHTML = toNodeHtml;
	        } else {
	            toNode = toElement(toNode);
	        }
	    }

	    // XXX optimization: if the nodes are equal, don't morph them
	    /*
	    if (fromNode.isEqualNode(toNode)) {
	      return fromNode;
	    }
	    */

	    var savedEls = {}; // Used to save off DOM elements with IDs
	    var unmatchedEls = {};
	    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
	    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
	    var onNodeAdded = options.onNodeAdded || noop;
	    var onBeforeElUpdated = options.onBeforeElUpdated || options.onBeforeMorphEl || noop;
	    var onElUpdated = options.onElUpdated || noop;
	    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
	    var onNodeDiscarded = options.onNodeDiscarded || noop;
	    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || options.onBeforeMorphElChildren || noop;
	    var childrenOnly = options.childrenOnly === true;
	    var movedEls = [];

	    function removeNodeHelper(node, nestedInSavedEl) {
	        var id = getNodeKey(node);
	        // If the node has an ID then save it off since we will want
	        // to reuse it in case the target DOM tree has a DOM element
	        // with the same ID
	        if (id) {
	            savedEls[id] = node;
	        } else if (!nestedInSavedEl) {
	            // If we are not nested in a saved element then we know that this node has been
	            // completely discarded and will not exist in the final DOM.
	            onNodeDiscarded(node);
	        }

	        if (node.nodeType === ELEMENT_NODE) {
	            var curChild = node.firstChild;
	            while (curChild) {
	                removeNodeHelper(curChild, nestedInSavedEl || id);
	                curChild = curChild.nextSibling;
	            }
	        }
	    }

	    function walkDiscardedChildNodes(node) {
	        if (node.nodeType === ELEMENT_NODE) {
	            var curChild = node.firstChild;
	            while (curChild) {


	                if (!getNodeKey(curChild)) {
	                    // We only want to handle nodes that don't have an ID to avoid double
	                    // walking the same saved element.

	                    onNodeDiscarded(curChild);

	                    // Walk recursively
	                    walkDiscardedChildNodes(curChild);
	                }

	                curChild = curChild.nextSibling;
	            }
	        }
	    }

	    function removeNode(node, parentNode, alreadyVisited) {
	        if (onBeforeNodeDiscarded(node) === false) {
	            return;
	        }

	        parentNode.removeChild(node);
	        if (alreadyVisited) {
	            if (!getNodeKey(node)) {
	                onNodeDiscarded(node);
	                walkDiscardedChildNodes(node);
	            }
	        } else {
	            removeNodeHelper(node);
	        }
	    }

	    function morphEl(fromEl, toEl, alreadyVisited, childrenOnly) {
	        var toElKey = getNodeKey(toEl);
	        if (toElKey) {
	            // If an element with an ID is being morphed then it is will be in the final
	            // DOM so clear it out of the saved elements collection
	            delete savedEls[toElKey];
	        }

	        if (!childrenOnly) {
	            if (onBeforeElUpdated(fromEl, toEl) === false) {
	                return;
	            }

	            morphAttrs(fromEl, toEl);
	            onElUpdated(fromEl);

	            if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
	                return;
	            }
	        }

	        if (fromEl.nodeName !== 'TEXTAREA') {
	            var curToNodeChild = toEl.firstChild;
	            var curFromNodeChild = fromEl.firstChild;
	            var curToNodeId;

	            var fromNextSibling;
	            var toNextSibling;
	            var savedEl;
	            var unmatchedEl;

	            outer: while (curToNodeChild) {
	                toNextSibling = curToNodeChild.nextSibling;
	                curToNodeId = getNodeKey(curToNodeChild);

	                while (curFromNodeChild) {
	                    var curFromNodeId = getNodeKey(curFromNodeChild);
	                    fromNextSibling = curFromNodeChild.nextSibling;

	                    if (!alreadyVisited) {
	                        if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
	                            unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl);
	                            morphEl(curFromNodeChild, unmatchedEl, alreadyVisited);
	                            curFromNodeChild = fromNextSibling;
	                            continue;
	                        }
	                    }

	                    var curFromNodeType = curFromNodeChild.nodeType;

	                    if (curFromNodeType === curToNodeChild.nodeType) {
	                        var isCompatible = false;

	                        // Both nodes being compared are Element nodes
	                        if (curFromNodeType === ELEMENT_NODE) {
	                            if (compareNodeNames(curFromNodeChild, curToNodeChild)) {
	                                // We have compatible DOM elements
	                                if (curFromNodeId || curToNodeId) {
	                                    // If either DOM element has an ID then we
	                                    // handle those differently since we want to
	                                    // match up by ID
	                                    if (curToNodeId === curFromNodeId) {
	                                        isCompatible = true;
	                                    }
	                                } else {
	                                    isCompatible = true;
	                                }
	                            }

	                            if (isCompatible) {
	                                // We found compatible DOM elements so transform
	                                // the current "from" node to match the current
	                                // target DOM node.
	                                morphEl(curFromNodeChild, curToNodeChild, alreadyVisited);
	                            }
	                        // Both nodes being compared are Text or Comment nodes
	                    } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
	                            isCompatible = true;
	                            // Simply update nodeValue on the original node to
	                            // change the text value
	                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
	                        }

	                        if (isCompatible) {
	                            curToNodeChild = toNextSibling;
	                            curFromNodeChild = fromNextSibling;
	                            continue outer;
	                        }
	                    }

	                    // No compatible match so remove the old node from the DOM
	                    // and continue trying to find a match in the original DOM
	                    removeNode(curFromNodeChild, fromEl, alreadyVisited);
	                    curFromNodeChild = fromNextSibling;
	                }

	                if (curToNodeId) {
	                    if ((savedEl = savedEls[curToNodeId])) {
	                        morphEl(savedEl, curToNodeChild, true);
	                        // We want to append the saved element instead
	                        curToNodeChild = savedEl;
	                    } else {
	                        // The current DOM element in the target tree has an ID
	                        // but we did not find a match in any of the
	                        // corresponding siblings. We just put the target
	                        // element in the old DOM tree but if we later find an
	                        // element in the old DOM tree that has a matching ID
	                        // then we will replace the target element with the
	                        // corresponding old element and morph the old element
	                        unmatchedEls[curToNodeId] = curToNodeChild;
	                    }
	                }

	                // If we got this far then we did not find a candidate match for
	                // our "to node" and we exhausted all of the children "from"
	                // nodes. Therefore, we will just append the current "to node"
	                // to the end
	                if (onBeforeNodeAdded(curToNodeChild) !== false) {
	                    fromEl.appendChild(curToNodeChild);
	                    onNodeAdded(curToNodeChild);
	                }

	                if (curToNodeChild.nodeType === ELEMENT_NODE &&
	                    (curToNodeId || curToNodeChild.firstChild)) {
	                    // The element that was just added to the original DOM may
	                    // have some nested elements with a key/ID that needs to be
	                    // matched up with other elements. We'll add the element to
	                    // a list so that we can later process the nested elements
	                    // if there are any unmatched keyed elements that were
	                    // discarded
	                    movedEls.push(curToNodeChild);
	                }

	                curToNodeChild = toNextSibling;
	                curFromNodeChild = fromNextSibling;
	            }

	            // We have processed all of the "to nodes". If curFromNodeChild is
	            // non-null then we still have some from nodes left over that need
	            // to be removed
	            while (curFromNodeChild) {
	                fromNextSibling = curFromNodeChild.nextSibling;
	                removeNode(curFromNodeChild, fromEl, alreadyVisited);
	                curFromNodeChild = fromNextSibling;
	            }
	        }

	        var specialElHandler = specialElHandlers[fromEl.nodeName];
	        if (specialElHandler) {
	            specialElHandler(fromEl, toEl);
	        }
	    } // END: morphEl(...)

	    var morphedNode = fromNode;
	    var morphedNodeType = morphedNode.nodeType;
	    var toNodeType = toNode.nodeType;

	    if (!childrenOnly) {
	        // Handle the case where we are given two DOM nodes that are not
	        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
	        if (morphedNodeType === ELEMENT_NODE) {
	            if (toNodeType === ELEMENT_NODE) {
	                if (!compareNodeNames(fromNode, toNode)) {
	                    onNodeDiscarded(fromNode);
	                    morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
	                }
	            } else {
	                // Going from an element node to a text node
	                morphedNode = toNode;
	            }
	        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
	            if (toNodeType === morphedNodeType) {
	                morphedNode.nodeValue = toNode.nodeValue;
	                return morphedNode;
	            } else {
	                // Text node to something else
	                morphedNode = toNode;
	            }
	        }
	    }

	    if (morphedNode === toNode) {
	        // The "to node" was not compatible with the "from node" so we had to
	        // toss out the "from node" and use the "to node"
	        onNodeDiscarded(fromNode);
	    } else {
	        morphEl(morphedNode, toNode, false, childrenOnly);

	        /**
	         * What we will do here is walk the tree for the DOM element that was
	         * moved from the target DOM tree to the original DOM tree and we will
	         * look for keyed elements that could be matched to keyed elements that
	         * were earlier discarded.  If we find a match then we will move the
	         * saved element into the final DOM tree.
	         */
	        var handleMovedEl = function(el) {
	            var curChild = el.firstChild;
	            while (curChild) {
	                var nextSibling = curChild.nextSibling;

	                var key = getNodeKey(curChild);
	                if (key) {
	                    var savedEl = savedEls[key];
	                    if (savedEl && compareNodeNames(curChild, savedEl)) {
	                        curChild.parentNode.replaceChild(savedEl, curChild);
	                        // true: already visited the saved el tree
	                        morphEl(savedEl, curChild, true);
	                        curChild = nextSibling;
	                        if (empty(savedEls)) {
	                            return false;
	                        }
	                        continue;
	                    }
	                }

	                if (curChild.nodeType === ELEMENT_NODE) {
	                    handleMovedEl(curChild);
	                }

	                curChild = nextSibling;
	            }
	        };

	        // The loop below is used to possibly match up any discarded
	        // elements in the original DOM tree with elemenets from the
	        // target tree that were moved over without visiting their
	        // children
	        if (!empty(savedEls)) {
	            handleMovedElsLoop:
	            while (movedEls.length) {
	                var movedElsTemp = movedEls;
	                movedEls = [];
	                for (var i=0; i<movedElsTemp.length; i++) {
	                    if (handleMovedEl(movedElsTemp[i]) === false) {
	                        // There are no more unmatched elements so completely end
	                        // the loop
	                        break handleMovedElsLoop;
	                    }
	                }
	            }
	        }

	        // Fire the "onNodeDiscarded" event for any saved elements
	        // that never found a new home in the morphed DOM
	        for (var savedElId in savedEls) {
	            if (savedEls.hasOwnProperty(savedElId)) {
	                var savedEl = savedEls[savedElId];
	                onNodeDiscarded(savedEl);
	                walkDiscardedChildNodes(savedEl);
	            }
	        }
	    }

	    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
	        // If we had to swap out the from node with a new node because the old
	        // node was not compatible with the target node then we need to
	        // replace the old DOM node in the original DOM tree. This is only
	        // possible if the original DOM node was part of a DOM tree which
	        // we know is the case if it has a parent node.
	        fromNode.parentNode.replaceChild(morphedNode, fromNode);
	    }

	    return morphedNode;
	}

	module.exports = morphdom;


/***/ },

/***/ 179:
/***/ function(module, exports) {

	module.exports = [
	  // attribute events (can be set with attributes)
	  'onclick',
	  'ondblclick',
	  'onmousedown',
	  'onmouseup',
	  'onmouseover',
	  'onmousemove',
	  'onmouseout',
	  'ondragstart',
	  'ondrag',
	  'ondragenter',
	  'ondragleave',
	  'ondragover',
	  'ondrop',
	  'ondragend',
	  'onkeydown',
	  'onkeypress',
	  'onkeyup',
	  'onunload',
	  'onabort',
	  'onerror',
	  'onresize',
	  'onscroll',
	  'onselect',
	  'onchange',
	  'onsubmit',
	  'onreset',
	  'onfocus',
	  'onblur',
	  'oninput',
	  // other common events
	  'oncontextmenu',
	  'onfocusin',
	  'onfocusout'
	]


/***/ }

/******/ });