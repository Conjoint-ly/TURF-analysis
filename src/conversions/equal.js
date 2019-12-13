/**
 * @param {Array} row
 * @param {Number} cutoffValue
 * @returns {boolean[]}
 */
const equal = (
  row, cutoffValue,
) => [...row].map((v) => v === cutoffValue);

module.exports = {
  equal,
};
