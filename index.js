const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/app-error');
const tourRouter = require('./routes/tour-route');
const userRouter = require('./routes/user-route');
const globalErrorHandler = require('./controllers/error-controller');
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
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
