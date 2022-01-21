
const express = require('express');

const {getAllTours, getTour, postTour, patchTour, deleteTour} = require('../controllers/tour-controller');



const tourRouter = express.Router();

tourRouter.route('/')
    .get(getAllTours)
    .post(postTour);

tourRouter.route('/:id')
    .get(getTour)
    .patch(patchTour)
    .delete(deleteTour);

module.exports = tourRouter;