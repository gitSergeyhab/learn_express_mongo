const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tour-route');
const userRouter = require('./routes/user-route');
const { ApiRoute } = require('./const');

const app = express();

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(ApiRoute.Tours, tourRouter);
app.use(ApiRoute.Users, userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Error',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  const err = new Error(`Can't find ${req.originalUrl}`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
