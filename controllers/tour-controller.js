const Tour = require('../models/tourModel');

// TOURS

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      time: req.requestTime,
      status: 'success',
      length: tours.length,
      data: { tours },
    });
  } catch {
    res.status(404).json({
      time: req.requestTime,
      status: 'Error',
      message: 'Something wrong',
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
