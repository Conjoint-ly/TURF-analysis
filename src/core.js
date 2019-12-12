const math = require('mathjs');
const conversions = require('./conversions');
const { NotEnoughDimensionsException } = require('./exceptions/NotEnoughDimensionsException');
const { UnknownConversionTypeException } = require('./exceptions/UnknownConversionTypeException');

function prepareMatrix(inputMatrix, conversionMethod, cutoffValue) {
  const preparedMatrix = [];

  inputMatrix.forEach((element) => {
    preparedMatrix.push(
      conversions[conversionMethod](element, cutoffValue),
    );
  });

  return {
    originalMatrix: math.matrix(this.originalMatrix),
    preparedMatrix: math.matrix(preparedMatrix),
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
 * @param {Number} index
 * @returns {*}
 */
const safeSubset = (value, index) => {
  const result = math.subset(value, index);

  return Array.isArray(result) ? result : [result];
};

/**
 * @param {Array} size
 * @param {Function} calcMetrics
 * @param {Number} [dimensions=1]
 * @param {Number} [top=20]
 * @TODO understand
 */
function searchInLadder(size, calcMetrics, dimensions = 1, top = 20) {
  if (dimensions > size[1]) {
    throw new NotEnoughDimensionsException();
  }

  const sequence = math.range(0, this.size[1]);
  const dimSequence = math.range(0, dimensions);

  let candidates = [];
  const joinedStrings = [];

  for (let i = 0; i < 1000; i += 1) {
    const elements = math.sort(math.pickRandom(sequence, dimensions));
    const joinedString = elements.join(',');
    if (joinedStrings.includes(joinedString)) {
      continue;
    }
    joinedStrings.push(joinedString);
    candidates.push(calcMetrics({ elements }));
  }

  candidates = math.sort(candidates, sortByReachAndFrequency);
  const minTop = math.min(top, candidates.length);
  candidates = safeSubset(candidates, math.index(math.rand(0, minTop)));

  for (let j = 0; j < 20; j += 1) {
    for (let i = 0; i < minTop; i += 1) {
      let elements = [...candidates[i].elements];
      // eslint-disable-next-line prefer-destructuring
      elements[math.pickRandom(dimSequence, 1)[0]] = math.pickRandom(sequence, 1)[0];

      if (checkDuplicates(elements)) {
        continue;
      }

      elements = math.sort(elements);
      const joinedString = elements.join(',');
      if (joinedStrings.includes(joinedString)) {
        continue;
      }
      joinedStrings.push(joinedString);
      candidates.push(calcMetrics({ elements }));
    }
    candidates = math.sort(candidates, sortByReachAndFrequency);
    candidates = safeSubset(candidates, math.index(math.range(0, minTop)));
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
  /**
   * @param {[Array]} inputMatrix
   * @param {('top'|'less'|'lessOrEqual'|'more'|'moreOrEqual')} [conversionMethod='top']
   * @param {Number} [cutoffValue=1]
   */
  constructor(inputMatrix, conversionMethod = 'top', cutoffValue = 1) {
    if (!(conversionMethod in conversions)) {
      throw new UnknownConversionTypeException();
    }

    const {
      // originalMatrix,
      preparedMatrix,
    } = prepareMatrix(inputMatrix, conversionMethod, cutoffValue);

    // this.originalMatrix = originalMatrix;
    this.preparedMatrix = preparedMatrix;
    this.preparedMatrixSize = preparedMatrix.size();
  }

  /**
   * @param {Object} source
   * @param {[Number]} source.elements
   * @param {String} source.name
   * @param {Boolean} [withReachByElement=false]
   * @returns {CalcMatrixResult}
   */
  calcMetrics(source, withReachByElement = false) {
    const i = math.zeros(this.preparedMatrixSize[1]);

    // @TODO understand
    source.elements.forEach((element) => {
      i.set([element], 1);
    });

    const product = math.multiply(this.preparedMatrix, i);
    const positiveCount = math.sum(math.isPositive(product));

    let reachByElement = null;

    // @TODO understand
    if (withReachByElement) {
      reachByElement = {
        common: math.sum(math.larger(product, 1)) / this.preparedMatrixSize[0],
      };

      source.elements.forEach((element) => {
        const subI = math.zeros(this.preparedMatrixSize[1]);
        subI.set([element], 1);
        const subProduct = math.multiply(this.preparedMatrix, subI);
        const specificCount = math.sum(
          math.and(
            math.equal(product, 1),
            math.equal(subProduct, 1),
          ),
        );
        reachByElement[`e${element}`] = specificCount / this.preparedMatrixSize[0];
      });
    }

    // @TODO understand
    return {
      frequency: math.sum(product) / positiveCount,
      reach: positiveCount / this.preparedMatrixSize[0],
      ...source,
      reachByElement,
    };
  }

  /**
   * @returns {CalcLadderResult}
   */
  calcLadder() {
    const ladder = [null];

    // @TODO understand
    for (let i = 1; i <= this.preparedMatrixSize[1]; i += 1) {
      // eslint-disable-next-line prefer-destructuring
      ladder[i - 1] = searchInLadder(
        this.preparedMatrixSize,
        this.calcMetrics,
        i,
      )[0];
      ladder[i - 1].name = `Top ${i === 1 ? 'item' : `${i}-way combo`}`;
    }

    return ladder;
  }
}

module.exports = {
  TurfAnalysis,
};
