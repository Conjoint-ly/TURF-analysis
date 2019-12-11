const lessOrEqual = (
  row, cutoffValue,
) => [...row].map((v) => v <= cutoffValue);

module.exports = {
  lessOrEqual,
};
