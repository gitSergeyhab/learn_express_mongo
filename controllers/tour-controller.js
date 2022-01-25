const Tour = require('../models/tourModel');

const EXCLUDED_FIELDS = ['page', 'sort', 'limit', 'fields'];
const transformQueryParams = /\b(gte|gt|lte|lt)\b/g;

const transformQuery = (query) => {
  const queryStr = JSON.stringify(query);
  const queryTrans = queryStr.replace(
    transformQueryParams,
    (match) => `$${match}`
  );
  return JSON.parse(queryTrans);
};

const makeSpace = (str) => (str ? str.split(',').join(' ') : '');
const getSkip = (page, limit) => (page - 1) * limit;

// TOURS

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-price';
  req.query.limit = '5';
  req.query.fields = 'name,price,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    const queryObj = { ...req.query };

    EXCLUDED_FIELDS.forEach((item) => delete queryObj[item]);

    const queryTrans = transformQuery(queryObj);

    let query = Tour.find(queryTrans);

    // 2. sort
    const sort = makeSpace(req.query.sort);
    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort('-createdAt');
    }

    //3 fields

    const fields = makeSpace(req.query.fields);
    if (fields) {
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4 pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;
    const skip = getSkip(page, limit);
    query = query.skip(skip).limit(limit);

    const numTours = await Tour.countDocuments();
    if (skip >= numTours) {
      throw new Error('This page does not exist');
    }

    const tours = await query;

    res.status(200).json({
      time: req.requestTime,
      status: 'success',
      length: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      time: req.requestTime,
      status: 'Error',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch {
    res.status(404).json({
      time: req.requestTime,
      status: 'Error',
      message: 'Something wrong',
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch {
    res.status(404).json({
      time: req.requestTime,
      status: 'Error',
      message: 'Something wrong',
    });
  }
};

exports.postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  } catch {
    res.status(404).json({
      status: 'Error',
      message: 'invalid Data',
    });
  }
};
