const Tour = require('../models/tour-model');
const APIFeatures = require('../utils/api-features');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-price';
  req.query.limit = '5';
  req.query.fields = 'name,price,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const futures = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .paginate();

  const tours = await futures.query;

  res.status(200).json({
    time: req.requestTime,
    status: 'success',
    length: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`There is no tour with ID: ${id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.patchTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`There is no tour with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.postTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError(`There is no tour with ID: ${id}`, 404));
  }

  res.status(204).json({
    status: 'success',
  });
});

exports.getTorStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatting: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxRating: { $max: '$price' },
      },
    },
    {
      $sort: { numRatting: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // зазбивает документ на несколько по полю - каждое поле в отднльный документ
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' }, // группировка по месяцам
        numTourStart: { $sum: 1 }, // за каждый документ +1
        tours: { $push: '$name' }, //добавить поле tours и запушить в него все поля  name соответствующего месяцу документа
      },
    },
    {
      $sort: { numTourStart: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
