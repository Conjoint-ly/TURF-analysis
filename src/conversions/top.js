const { lessOrEqual } = require('./lessOrEqual');

const rank = (arr) => {
  const sorted = [...arr].sort((a, b) => b - a);

  return [...arr].map((v) => sorted.indexOf(v) + 1);
};

const top = (
  row, cutoffValue,
) => lessOrEqual(
  rank(row), cutoffValue,
);

export {
  top,
};
