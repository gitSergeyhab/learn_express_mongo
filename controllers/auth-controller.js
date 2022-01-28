const jwt = require('jsonwebtoken');

const AppError = require('../utils/app-error');

const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');

exports.signup = catchAsync(async (req, res, next) => {
  // const user = await User.create(req.body);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRESS_IN,
  });

  res.status(201).json({
    status: 'success',
    data: { user },
    token,
  });
});

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  console.log(125456);

  if (!email || !password) {
    next(new AppError('Provide login and password', 400));
  }

  const token = '';

  res.status(201).json({
    status: 'success',
    token,
  });
};
