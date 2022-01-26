const { getSkip, makeSpace, transformQuery } = require('./utils');

const EXCLUDED_FIELDS = ['page', 'sort', 'limit', 'fields'];

const DefaultParam = {
  Sort: '-createdAt',
  Select: '-__v',
  Page: 1,
  Limit: 5,
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    EXCLUDED_FIELDS.forEach((item) => delete queryObj[item]);
    const queryTrans = transformQuery(queryObj);
    this.query.find(queryTrans);
    return this;
  }

  sort() {
    const sort = makeSpace(this.queryString.sort);
    this.query = sort
      ? this.query.sort(sort)
      : this.query.sort(DefaultParam.Sort);
    return this;
  }

  selectFields() {
    const fields = makeSpace(this.queryString.fields);
    this.query = fields
      ? this.query.select(fields)
      : this.query.select(DefaultParam.Select);
    return this;
  }

  paginate() {
    const page = +this.queryString.page || DefaultParam.Page;
    const limit = +this.queryString.limit || DefaultParam.Limit;
    const skip = getSkip(page, limit);
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
