const more = (
  row, cutoffValue,
) => [...row].map((v) => v > cutoffValue);

module.exports = {
  more,
};
