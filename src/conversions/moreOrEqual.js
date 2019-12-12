/**
 * @param {Array} row
 * @param {Number} cutoffValue
 * @returns {boolean[]}
 */
const moreOrEqual = (
  row, cutoffValue,
) => [...row].map((v) => v >= cutoffValue);

module.exports = {
  moreOrEqual,
};
