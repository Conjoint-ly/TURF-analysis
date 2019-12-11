const moreOrEqual = (
  row, cutoffValue,
) => [...row].map((v) => v >= cutoffValue);

module.exports = {
  moreOrEqual,
};
