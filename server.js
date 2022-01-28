const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./index');

process.on('uncaughtException', (err) => {
  console.log('!!! uncaught Exception !!!');
  console.log(err.name, err.message);
  process.exit(1);
});

const dataBase = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(dataBase, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected!'));

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`App listen port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('!!! unhandled Rejection !!!');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
