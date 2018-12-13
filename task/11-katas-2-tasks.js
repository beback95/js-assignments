
/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist
 * in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account
 * that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it
 * into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
  const line1 = ' _     _  _     _  _  _  _  _ ';
  const line2 = '| |  | _| _||_||_ |_   ||_||_|';
  const line3 = '|_|  ||_  _|  | _||_|  ||_| _|';

  const getAssociate = () => {
    const obj = [];

    for(let i = 0, length = line1.length / 3; i < length; i++) {
      const indexI = i * 3;
      const indexJ = indexI + 3;
      // eslint-disable-next-line
      obj[i] = `${line1.substring(indexI, indexJ)}${line2.substring(indexI, indexJ)}${line3.substring(indexI, indexJ)}`;
    }

    return obj;
  };

  this.associate = this.associate ? this.associate : getAssociate();

  let result = '';

  const lines = bankAccount.split('\n');

  for(let i = 0, length = lines[0].length / 3; i < length; i++) {
    const indexI = i * 3;
    const indexJ = indexI + 3;
    // eslint-disable-next-line
    const str = `${lines[0].substring(indexI, indexJ)}${lines[1].substring(indexI, indexJ)}${lines[2].substring(indexI, indexJ)}`;

    result += this.associate.indexOf(str);
  }

  return Number.parseInt(result, 10);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make
 * sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>
 *      'The String global object',
 *      'is a constructor for',
 *      'strings, or a sequence of',
 *      'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>
 *      'The String',
 *      'global',
 *      'object is a',
 *      'constructor',
 *      'for strings,',
 *      'or a',
 *      'sequence of',
 *      'characters.'
 */
function* wrapText(text, columns) {
  const words = text.split(' ');
  let str = '';

  while(words.length) {
    if(`${str}${words[0]}`.length > columns) {
      yield str.trim();
      str = '';
    }

    str += `${words.shift()} `;
  }

  yield str.trim();
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0
};

function getPokerHandRank(hand) {
  const convertHand = hand => {
    return hand.map(card => {
      const rank = parseInt(card);
      const suit = card[card.length - 1];

      if(rank) {
        return {
          rank,
          suit
        };
      } else {
        switch(card[0]) {
        case 'J': return {
          rank: 11,
          suit
        };
        case 'Q': return {
          rank: 12,
          suit
        };
        case 'K': return {
          rank: 13,
          suit
        };
        case 'A': return {
          rank: 14,
          suit
        };
        }
      }
    }).sort((first, second) => second.rank - first.rank);
  };

  const isSameSuit = hand => {
    return hand.every(card => card.suit === hand[0].suit);
  };

  const isSequentialRank = hand => {
    return hand.every((card, index, array) => {
      if(index !== array.length - 1) {
        const diff = card.rank - array[index + 1].rank;

        return diff === 1 || diff === 9 && card.rank === 14;
      } else {
        return true;
      }
    }, true);
  };

  const getNumberEntries = hand => {
    return Object.values(hand
      .reduce((acc, card) => {
        if(acc[card.rank]) {
          acc[card.rank].push(card);
          return acc;
        } else {
          return Object.assign(acc, { [card.rank]: [card] });
        }
      }, {}))
      .map(entry => entry.length)
      .sort((first, second) => second - first);
  };

  const _hand = convertHand(hand);
  const entries = getNumberEntries(_hand);

  if(isSameSuit(_hand) && isSequentialRank(_hand)) {
    return PokerRank.StraightFlush;
  } else if(entries[0] === 4) {
    return PokerRank.FourOfKind;
  } else if(entries[0] === 3 && entries[1] === 2) {
    return PokerRank.FullHouse;
  } else if(isSameSuit(_hand)) {
    return PokerRank.Flush;
  } else if(isSequentialRank(_hand)) {
    return PokerRank.Straight;
  } else if(entries[0] === 3) {
    return PokerRank.ThreeOfKind;
  } else if(entries[0] === 2 && entries[1] === 2) {
    return PokerRank.TwoPairs;
  } else if(entries[0] === 2 ) {
    return PokerRank.OnePair;
  }

  return PokerRank.HighCard;
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +,
 * vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+        '+------------+\n'+
 *    '|            |\n'+        '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+   =>   '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+        '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'         '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */

function* getFigureRectangles(figure) {
  function getRectangleParams(figure, [posI, posJ]) {
    if([undefined, ' '].includes(figure[posI][posJ + 1])
    || !'+|'.includes(figure[posI + 1][posJ])) {
      return 'does not exist';
    }

    for(let i = posI, lengthI = figure.length; i < lengthI; i++) {
      for(let j= posJ + 1, lengthJ = figure[i].length; j < lengthJ; j++) {
        if(figure[i][j] === '+' && '+|'.includes(figure[i + 1][j])) {
          for(let k = posI + 1;; k++) {
            if(figure[k][j] === '+') {
              const width = j - posJ - 1;
              const height = k - posI - 1;

              return [width, height];
            }
          }
        }
      }
    }

    return 'does not exist';
  }

  function renderRectangle([width, height]) {
    const topOrBottom = `+${'-'.repeat(width)}+\n`;
    const sides = `|${' '.repeat(width)}|\n`;

    return [topOrBottom, ...sides.repeat(height), topOrBottom].join('');
  }

  const _figure = figure.split('\n');

  for(let i = 0, lengthI = _figure.length - 1; i < lengthI; i++) {
    for(let j = 0, lengthJ = _figure[i].length; j < lengthJ; j++) {
      if(_figure[i][j] === '+') {
        const params = getRectangleParams(_figure, [i, j]);

        if(params !== 'does not exist') {
          yield renderRectangle(params);
        }
      }
    }
  }
}

module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles
};
