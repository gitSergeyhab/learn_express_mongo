const transformQueryParams = /\b(gte|gt|lte|lt)\b/g;

exports.transformQuery = (query) => {
  const queryStr = JSON.stringify(query);
  const queryTrans = queryStr.replace(
    transformQueryParams,
    (match) => `$${match}`
  );
  return JSON.parse(queryTrans);
};

exports.makeSpace = (str) => (str ? str.split(',').join(' ') : '');
exports.getSkip = (page, limit) => (page - 1) * limit;
