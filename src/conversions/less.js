/**
 * @param {Array} row
 * @param {Number} cutoffValue
 * @returns {boolean[]}
 */
const less = (
  row, cutoffValue,
) => [...row].map((v) => v < cutoffValue);

module.exports = {
  less,
};
