const { lessOrEqual } = require('./lessOrEqual');

/**
 * @param {Array} arr
 * @returns {number[]}
 */
const rank = (arr) => {
  const sorted = [...arr].sort((a, b) => b - a);

  return [...arr].map((v) => sorted.indexOf(v) + 1);
};

/**
 * @param {Array} row
 * @param {Number} cutoffValue
 * @returns {boolean[]}
 */
const top = (
  row, cutoffValue,
) => lessOrEqual(
  rank(row), cutoffValue,
);

module.exports = {
  top,
};
