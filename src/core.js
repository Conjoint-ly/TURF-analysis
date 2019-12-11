const conversions = require('./conversions');
const { UnknownConversionTypeException } = require('./exceptions/UnknownConversionTypeException');

class TurfAnalysis {
  constructor(matrix, conversionMethod = 'top', cutoffValue = 1) {
    if (!(conversionMethod in conversions)) {
      throw new UnknownConversionTypeException();
    }

    this.matrix = matrix;
    this.conversionMethod = conversionMethod;
    this.cutoffValue = cutoffValue;

    this.prepareMatrix();
  }

  prepareMatrix() {
    const preparedMatrix = [];

    this.matrix.forEach((element) => {
      preparedMatrix.push(
        conversions[this.conversionMethod](element, this.cutoffValue),
      );
    });

    this.preparedMatrix = preparedMatrix;
  }
}

module.exports = {
  TurfAnalysis,
};
