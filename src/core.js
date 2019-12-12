const math = require('mathjs');
const conversions = require('./conversions');
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
 * @param {Array} size
 * @param {Function} calcMetrics
 * @param {Number} [dim=1]
 * @param {Number} [top=20]
 */
function searchInLadder(size, calcMetrics, dim = 1, top = 20) {

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
