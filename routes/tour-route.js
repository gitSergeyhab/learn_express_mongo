
const fs = require('fs')
const express = require('express');
const {Path} = require('../const');


const tours = JSON.parse(fs.readFileSync(`${__dirname}${Path.TourSimple}`));

// TOURS
const getAllTours = (req, res) => {
    res
        .status(200)
        .json({
            time: req.requestTime,
            status: 'success',
            length: tours.length,
            data: {tours},
        });
}

const getTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find((item) => item.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no tour with ID :  ${id}`
        })
    }
    res
        .status(200)
        .json({
            status: 'success',
            data: {tour},
        });
};

const patchTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find((item) => item.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no tour with ID :  ${id}`
        })
    }
    const body = req.body;
    res
        .status(200)
        .json({
            status: 'success',
            data: {body},
        });
};

const postTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {...req.body, id: newId};
    const newTours = [...tours, newTour];
    fs.writeFile(`${__dirname}${Path.TourSimple}`, JSON.stringify(newTours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {tour: newTour},
        })
    })
};



const deleteTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find((item) => item.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no tour with ID :  ${id}`
        })
    }
    res
        .status(204)
        .json({
            status: 'success',
            data: {delete: true},
        });
};

const tourRouter = express.Router();

tourRouter.route('/')
    .get(getAllTours)
    .post(postTour);

tourRouter.route('/:id')
    .get(getTour)
    .patch(patchTour)
    .delete(deleteTour);

module.exports = tourRouter;