
/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height= height; 
}

Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const PART_ENUM = {
  NONE: 0,
  ELEMENT: 1,
  ID: 2,
  CLASS: 3,
  ATTR: 4,
  PSEUDOCLASS: 5,
  PSEUDOELEMENT: 6
};


class CssSelector {
  constructor() { 
    this._element = ''; 
    this._id = ''; 
    this._class = []; 
    this._attr = []; 
    this._pseudoClass = []; 
    this._pseudoElement = '';
    this._lastPart = PART_ENUM.NONE;
  }

  element(value) {
    if(this._element.length) {
      // eslint-disable-next-line
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.checkPart(PART_ENUM.ELEMENT);
    this._element = value;
    return this;
  }

  getElement() {
    return this._element;
  }

  id(value) {
    if(this._id.length) {
      // eslint-disable-next-line
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.checkPart(PART_ENUM.ID);
    this._id = value;
    return this;
  }

  getId() {
    return this._id ? `#${ this._id}` : '';
  }

  class(value) {
    this.checkPart(PART_ENUM.CLASS);
    this._class.push(value);
    return this;
  }

  getClass() {
    return this._class.map(_class => `.${_class}`).join('');
  }

  attr(value) {
    this.checkPart(PART_ENUM.ATTR);
    this._attr.push(value);
    return this;
  }

  getAttr() {
    return this._attr.map(_attr => `[${_attr}]`).join('');
  }

  pseudoClass(value) {
    this.checkPart(PART_ENUM.PSEUDOCLASS);
    this._pseudoClass.push(value);
    return this;
  }

  getPseudoClass() {
    return this._pseudoClass.map(_pseudoClass => `:${_pseudoClass}`).join('');
  }

  pseudoElement(value) {
    if(this._pseudoElement.length) {
      // eslint-disable-next-line
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.checkPart(PART_ENUM.PSEUDOELEMENT);
    this._pseudoElement = value;
    return this;
  }

  getPseudoElement() {
    return this._pseudoElement ? `::${this._pseudoElement}` : '';
  }

  stringify() {
    // eslint-disable-next-line
    return `${this.getElement()}${this.getId()}${this.getClass()}${this.getAttr()}${this.getPseudoClass()}${this.getPseudoElement()}`;
  }

  checkPart(currentPart) {
    if(currentPart < this._lastPart) {
      // eslint-disable-next-line
      throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
    }
    this._lastPart = currentPart;
  }
}

class SelectorsCombination {
  constructor() {
    this._selectors = [];
    this._combinators = [];
  }

  setSelectors(...selectors) {
    this._selectors.push(...selectors);
  }

  setCombinators(combinator) {
    this._combinators.push(` ${combinator} `);
  }

  stringify() {
    let combination = '';

    for(let i = 0; i < this._combinators.length; i++) {
      // eslint-disable-next-line
      combination += this._selectors[i].stringify() + this._combinators[i] + this._selectors[i + 1].stringify();
    }

    return combination;
  }
}

const cssSelectorBuilder = {

  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const combination = new SelectorsCombination();
    combination.setSelectors(selector1, selector2);
    combination.setCombinators(combinator);

    return combination;
  }
};

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder
};
