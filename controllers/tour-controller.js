const Tour = require('../models/tour-model');
const APIFeatures = require('../utils/api-features');

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-price';
  req.query.limit = '5';
  req.query.fields = 'name,price,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      time: req.requestTime,
      status: 'fail',
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
      status: 'fail',
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
      status: 'fail',
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
      status: 'fail',
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
      status: 'fail',
      message: 'invalid Data',
    });
  }
};

exports.getTorStats = async (req, res) => {
  try {
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
  } catch {
    res.status(404).json({
      status: 'fail',
      message: 'invalid Data',
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  const year = +req.params.year;
  try {
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
  } catch {
    res.status(404).json({
      status: 'fail',
      message: 'invalid Data',
    });
  }
};
