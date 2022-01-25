const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const addDataToDB = async () => {
  try {
    await Tour.create(tours);
    console.log('db created');
  } catch (err) {
    console.log('db did not create', err);
  }
  process.exit();
};

const deleteDataFromDB = async () => {
  try {
    await Tour.deleteMany();
    console.log('db deleted');
  } catch (err) {
    console.log('db did not delete', err);
  }
};

const arg = process.argv[2];

switch (arg) {
  case '--add':
    addDataToDB();
    break;
  case '--delete':
    deleteDataFromDB();
    break;
  default:
    console.log('ERROR: need a arg: --add or --delete');
}

// node dev-data\data\import-data.js --arg
