const {
  matrix, subset, larger, range, pickRandom,
  sort, min, index, zeros, multiply, sum,
  isPositive, and, equal,
} = require('mathjs');
const conversions = require('./conversions');
const { NotEnoughDimensionsException } = require('./exceptions/NotEnoughDimensionsException');
const { UnknownConversionTypeException } = require('./exceptions/UnknownConversionTypeException');

function prepareMatrix(inputMatrix, conversionMethod, cutoffValue) {
  const preparedMatrix = [];

  inputMatrix.forEach((element) => {
    preparedMatrix.push(
      conversions[conversionMethod](
        element.map((cell) => ((Number(cell) !== cell) ? 1 : cell)),
        cutoffValue,
      ),
    );
  });

  return {
    originalMatrix: matrix(inputMatrix),
    preparedMatrix: matrix(preparedMatrix),
  };
}

/**
 * @typedef LadderElement
 * @property {number} reach
 * @property {number} frequency
 */

/**
 * @param {LadderElement} a
 * @param {LadderElement} b
 * @returns {number}
 */
const sortByReachAndFrequency = (a, b) => {
  let diff = b.reach - a.reach;
  if (diff === 0) {
    diff = b.frequency - a.frequency;
  }

  return diff;
};

/**
 * @param {Array} arr
 * @returns {boolean}
 */
const checkDuplicates = (arr) => {
  const object = {};

  for (let i = 0; i < arr.length; i += 1) {
    if (!(arr[i] in object)) {
      object[arr[i]] = 1;
    } else {
      return true;
    }
  }

  return false;
};

/**
 * @param {Array} value
 * @param {Number} maxIndex
 * @returns {*}
 */
const safeSubset = (value, maxIndex) => {
  const result = subset(value, maxIndex);

  return Array.isArray(result) ? result : [result];
};

/**
 * @param {Array} size
 * @param {Function} calcMetrics
 * @param {Number} [elementsLength=1]
 * @param {Number} [top=20]
 */
function searchInLadder(size, calcMetrics, elementsLength = 1, top = 20) {
  if (elementsLength > size[1]) {
    throw new NotEnoughDimensionsException();
  }

  const sequence = range(0, size[1]);
  const dimSequence = range(0, elementsLength);

  let candidates = [];
  const joinedStrings = [];

  for (let i = 0; i < 1000; i += 1) {
    const elements = sort(pickRandom(sequence, elementsLength));
    const joinedString = elements.join(',');
    if (joinedStrings.includes(joinedString)) {
      continue;
    }
    joinedStrings.push(joinedString);
    candidates.push(calcMetrics({ source: { elements } }));
  }

  candidates = sort(candidates, sortByReachAndFrequency);
  const minTop = min(top, candidates.length);
  candidates = safeSubset(candidates, index(range(0, minTop)));

  for (let j = 0; j < 20; j += 1) {
    for (let i = 0; i < minTop; i += 1) {
      let elements = [...candidates[i].elements];
      // eslint-disable-next-line prefer-destructuring
      elements[pickRandom(dimSequence, 1)[0]] = pickRandom(sequence, 1)[0];

      if (checkDuplicates(elements)) {
        continue;
      }

      elements = sort(elements);
      const joinedString = elements.join(',');
      if (joinedStrings.includes(joinedString)) {
        continue;
      }
      joinedStrings.push(joinedString);
      candidates.push(calcMetrics({ source: { elements } }));
    }
    candidates = sort(candidates, sortByReachAndFrequency);
    candidates = safeSubset(candidates, index(range(0, minTop)));
  }

  return candidates;
}

/**
 * @typedef CalcMatrixResult
 * @property {Number} frequency
 * @property {Number} reach
 * @property {[Number]} elements
 * @property {String} name
 * @property {Object} reachByElement
 */

/**
 * @typedef CalcLadderResult
 *
 */

/**
 * @class
 * @classdesc TURF Analysis
 */
class TurfAnalysis {
  static getConversionMethods() {
    return conversions;
  }

  /**
   * @param {[[Number]]} records
   * @param {('top'|'equal'|'less'|'lessOrEqual'|'more'|'moreOrEqual')} [conversionMethod='top']
   * @param {Number} [cutoffValue=1]
   */
  constructor(records, conversionMethod = 'top', cutoffValue = 1) {
    if (!(conversionMethod in conversions)) {
      throw new UnknownConversionTypeException();
    }

    const {
      // originalMatrix,
      preparedMatrix,
    } = prepareMatrix(records, conversionMethod, cutoffValue);

    // this.originalMatrix = originalMatrix;
    this.preparedMatrix = preparedMatrix;
    this.preparedMatrixSize = preparedMatrix.size();
  }

  /**
   * @param {Object} args
   * @param {Object} args.source
   * @param {[Number]} args.source.elements
   * @param {String} args.source.name
   * @param {Boolean} args.withReachByElement [withReachByElement=false]
   * @param {Function} handler
   * @returns {CalcMatrixResult}
   */
  calcMetrics({
    source,
    withReachByElement = false,
  }, handler = null) {
    const i = zeros(this.preparedMatrixSize[1]);

    source.elements.forEach((element) => {
      i.set([element], 1);
    });

    const product = multiply(this.preparedMatrix, i);
    const positiveCount = sum(isPositive(product));

    let reachByElement = null;

    if (withReachByElement) {
      reachByElement = {
        common: sum(larger(product, 1)) / this.preparedMatrixSize[0],
      };

      source.elements.forEach((element, elIndex) => {
        const subI = zeros(this.preparedMatrixSize[1]);
        subI.set([element], 1);
        const subProduct = multiply(this.preparedMatrix, subI);
        const specificCount = sum(
          and(
            equal(product, 1),
            equal(subProduct, 1),
          ),
        );
        reachByElement[`e${element}`] = specificCount / this.preparedMatrixSize[0];

        if (handler) {
          handler((elIndex + 1) / source.elements.length);
        }
      });
    }

    return {
      frequency: sum(product) / positiveCount,
      reach: positiveCount / this.preparedMatrixSize[0],
      ...source,
      reachByElement,
    };
  }

  /**
   * @param {Object} args
   * @param {Function} handler
   * @returns {CalcLadderResult}
   */
  calcLadder(args, handler) {
    const ladder = [null];

    for (let i = 1; i <= this.preparedMatrixSize[1]; i += 1) {
      // eslint-disable-next-line prefer-destructuring
      ladder[i - 1] = searchInLadder(
        this.preparedMatrixSize,
        this.calcMetrics.bind(this),
        i,
      )[0];
      ladder[i - 1].name = `Top ${i === 1 ? 'item' : `${i}-way combo`}`;

      if (handler) {
        console.log(i, this.preparedMatrixSize[1]);
        handler(i / this.preparedMatrixSize[1]);
      }
    }

    return ladder;
  }
}

module.exports = {
  TurfAnalysis,
};
