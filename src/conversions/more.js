/**
 * @param {Array} row
 * @param {Number} cutoffValue
 * @returns {boolean[]}
 */
const more = (
  row, cutoffValue,
) => [...row].map((v) => v > cutoffValue);

module.exports = {
  more,
};
