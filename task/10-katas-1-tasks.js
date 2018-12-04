
/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints(sides = ['N', 'E', 'S', 'W']) {
  const array = [];
  let azimuth = 0;
  let abbreviation = '';
  sides.push(sides[0]);

  const getAbbreviation = (function () {
    let counter = 0;

    return function(current, next, numberSide) {
      const middle = numberSide % 2 ? `${next}${current}` : `${current}${next}`;
      counter++;

      switch (counter) {
      case 1: return `${current}`;
      case 2: return `${current}b${next}`;
      case 3: return `${current}${middle}`;
      case 4: return `${middle}b${current}`;
      case 5: return `${middle}`;
      case 6: return `${middle}b${next}`;
      case 7: return `${next}${middle}`;
      case 8: return `${next}b${current}`;
      default: counter = 0;
      }
    };
  })();

  for(let i = 0, l = sides.length - 1; i < l; i++) {
    while((abbreviation = getAbbreviation(sides[i], sides[i + 1], i))) {
      array.push({
        abbreviation,
        azimuth
      });

      azimuth += 11.25;
    }
  }

  return array;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear
 * at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
  const toExpand = [str];
  const expanded = [];

  while (toExpand.length > 0) {
    const string = toExpand.pop();
    const matched = string.match(/{([^{}]*)}/);

    if(matched) {
      const replacements = matched[1].split(',');

      for (const replacement of replacements) {
        toExpand.push(string.replace(matched[0], replacement));
      }

    } else if (!expanded.includes(string)) {
      expanded.push(string);
      yield string;
    }
  }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient
 * of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */

function getZigZagMatrix(n) {
  function generateArr(n) {
    return Array.from({ length: n }, () => Array.from({length: n }, () => 0));
  }

  const array = generateArr(n);
  let row = 0;
  let column = 0;

  for(let val = 0, length = Math.pow(n, 2); val < length; val++) {
    array[row][column] = val;

    if ((row + column) % 2 === 0) {
      if (column + 1 < n) {
        column++;
      } else {
        row += 2;
      }
      if (row > 0) {
        row--;
      }
    } else {
      if (row + 1 < n) {
        row++;
      } else {
        column += 2;
      }
      if (column > 0) {
        column--;
      }
    }
  }

  return array;
}

/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row
 *  (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
  const _dominoes = dominoes.slice();
  let currentDomino = _dominoes.shift();
  let counter = 0;

  while(dominoes.length > counter) {
    for(let i = 0, l = _dominoes.length; i < l; i++) {
      const domino = _dominoes[i];

      const contains = currentDomino.some(value => {
        return domino && (value === domino[0] ||
        value === domino[1]);
      });

      if(contains) {
        currentDomino = _dominoes.splice(i, 1)[0];
      }
    }

    counter++;
  }

  return !_dominoes.length;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end
 *     integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to
 *     more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
  const _nums = nums.slice();
  const ranges = [];
  let start = 0;
  let end = 0;

  while (_nums.length) {
    start = _nums.shift();
    end = start;

    while (_nums.length && _nums[0] - end === 1) {
      end = _nums.shift();
    }

    switch (end - start) {
    case 0:
      ranges.push(start);
      break;
    case 1:
      ranges.push(start);
      ranges.push(end);
      break;
    default:
      ranges.push(`${start}-${end}`);
      break;
    }
  }

  return ranges.join();
}

/*
if(current - start > 1) {
        rangesString += `${start}-${current}`;
      } else {
        rangesString += `${start},${current}`
      }
    }
*/

module.exports = {
  createCompassPoints : createCompassPoints,
  expandBraces : expandBraces,
  getZigZagMatrix : getZigZagMatrix,
  canDominoesMakeRow : canDominoesMakeRow,
  extractRanges : extractRanges
};
