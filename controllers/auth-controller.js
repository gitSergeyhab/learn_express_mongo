const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/app-error');

const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRESS_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  // const user = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    data: { user },
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError('Provide login and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  const isPasswordCorrect = await user.comparePassword(password, user.password);
  console.log(password, user.password, isPasswordCorrect);

  if (!user || !isPasswordCorrect) {
    return next(new AppError('incorrect email or password', 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    // user,
    token,
  });
});

// проверка, что пользоватеть авторизовался
exports.protect = async (req, res, next) => {
  // 1/ проверка, что в есть заголовок "Bearer USER_TOKEN"
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    token = auth.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you are not logged in', 401));
  }

  //2. verification - проверка правильности токена
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded', decoded);

  //3 check user exists

  const freshUser = await User.findById(decoded.id);
  // console.log('freshUser', freshUser);

  if (!freshUser) {
    return next(new AppError('The use with this token no longer exist', 401));
  }

  //4 check is user changed password
  if (freshUser.checkPasswordChanged(decoded.iat)) {
    return next(new AppError('user changed password, log in again', 401));
  }

  req.user = freshUser;
  next();
};
