
/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left,
 * right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
  const _puzzle = transformPuzzle(puzzle);
  const _map = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const _searchStr = searchStr.split('');
  const _searchChar = _searchStr.shift();

  const pathStore = (function(){
    const path = [];

    return function(point) {
      if(!point) {
        return path;
      } else {
        path.push(point);
      }
    }
  })();

  function transformPuzzle(puzzle) {
    const empty = Array.from({ length: puzzle[0].length + 2 }, () => ' ');

    const _puzzle = puzzle.map(string => {
      return [' ', ...string.split(''), ' '];
    });

    return [empty, ..._puzzle, empty];
  }

  function check(row, col, search)  {
    const stack = [];

    _map.forEach(dir => {
      const curRow = row + dir[0];
      const curCol = col + dir[1];

      if(_puzzle[curRow][curCol] === search[0]) {
        stack.push([curRow, curCol, search.slice(1), stack.length + 1]);
        pathStore([curRow, curCol]);
      }
    });

    if(search.length === 0 || stack.some(elem => {
      return check(...elem);
    })) {
      return true;
    }
  }

  for(let row = 0, lrows = _puzzle.length; row < lrows; row++) {
    for(let col = 0, lcols = _puzzle[row].length; col < lcols; col++) {
      if(_puzzle[row][col] === _searchChar && check(row, col, _searchStr)) {
        const path = pathStore();
        const lastPoint = path[path.length - 1];

        if(!(searchStr, lastPoint[0] === row && lastPoint[1] === col)) {
          return true;
        }
      }
    }
  }
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from
 *    the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
  function *shake(length, rest) {
    if (length === 1) {
      yield rest.join('');
    } else {
      let temp;

      for (let i = 0; i < length; i++) {
        yield *shake(length - 1, rest);

        if (length % 2 === 0) {
          temp = rest[i];
          rest[i] = rest[length - 1];
          rest[length - 1] = temp;
        } else {
          temp = rest[0];
          rest[0] = rest[length - 1];
          rest[length - 1] = temp;
        }
      }
    }
  }

  yield *shake(chars.length, chars.split(''));
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units
 * you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence
 * of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
  return quotes.reduce((acc, quote, index, array) => {
    return acc + (Math.max(...array.slice(index)) - quote);
  }, 0);
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *   var urlShortener = new UrlShortener();
 *   var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *   var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
  this.urlAllowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                          'abcdefghijklmnopqrstuvwxyz' +
                          "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {
  encode(url) {
    const urlAllowedChars = this.urlAllowedChars.split('');
    const _url = url.split('');
    const newCodes = [];

    const codesString = _url.reduce((acc, char) => {
      return acc + (urlAllowedChars.findIndex(_char => _char === char) + 10);
    }, '').split('');

    while(codesString.length) {
      newCodes.push(codesString.splice(0, 4).join(''));
    }

    return newCodes.map(code => String.fromCharCode(code)).join('');
  },

  decode(code) {
    const urlAllowedChars = this.urlAllowedChars.split('');
    const _code = code.split('');
    const oldCodes = [];

    const codesString = _code.reduce((acc, code) => {
      return acc + code.charCodeAt();
    }, '').split('');

    while(codesString.length) {
      oldCodes.push((+codesString.splice(0, 2).join('') - 10));
    }

    return oldCodes.map(code => urlAllowedChars[code]).join('');
  }
};

module.exports = {
  findStringInSnakingPuzzle: findStringInSnakingPuzzle,
  getPermutations: getPermutations,
  getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
  UrlShortener: UrlShortener
};
