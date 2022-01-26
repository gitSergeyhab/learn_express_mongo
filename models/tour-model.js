const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'priceDiscount {{VALUE}} must be below price',
      },
    },
    summary: {
      type: String,
      trim: true,
      // required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      // required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // не показывать при запросе
    },
    startDates: [Date],
    isSecretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, // добавляет виртуальные поля в документы
  }
);

tourSchema.virtual('durationWeek', function () {
  return this.duration / 7; // добавляет виртуальные поля в документы
});

// middleware before save
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //добавляет поля slug в документы
  next();
});

// middleware after save
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// middleware before find
tourSchema.pre('find', function (next) {
  this.find({ isSecretTour: { $ne: true } }); // перед поиском фильтрут данные - в этом случае выдает только документы с полем isSecretTour: false
  // но по findById показывать будет - чтобы не показывал : tourSchema.pre('/^find/', function (next) {})
  next();
});

// middleware before aggregarion
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isSecretTour: { $ne: true } } }); // вставляет в начало aggregate match, убирающий  isSecretTour: false
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
