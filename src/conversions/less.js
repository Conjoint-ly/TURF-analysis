const less = (
  row, cutoffValue,
) => [...row].map((v) => v < cutoffValue);

module.exports = {
  less,
};
