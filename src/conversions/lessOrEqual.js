/**
 * @param {Array} row
 * @param {Number} cutoffValue
 * @returns {boolean[]}
 */
const lessOrEqual = (
  row, cutoffValue,
) => [...row].map((v) => v <= cutoffValue);

module.exports = {
  lessOrEqual,
};
