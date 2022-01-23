
const fs = require('fs')
const {Path} = require('../const');


const tours = JSON.parse(fs.readFileSync(`${__dirname}${Path.TourSimple}`));


// TOURS
exports.checkID = (req, res, next, id) => {
    console.log(id);
    const tour = tours.find((item) => item.id === +id);
    if (!tour) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no tour with ID :  ${id}`,
        })
    }
    next();
}


exports.checkBody = (req, res, next) => {
    console.log('checkBody', req.body)
    if (!req.body.name) {
        return res.status(400).json({
            status: 'ERROR',
            message: `there is no name!`,
        }) 
    }
    next();
}

exports.getAllTours = (req, res) => {
    res
        .status(200)
        .json({
            time: req.requestTime,
            status: 'success',
            length: tours.length,
            data: {tours},
        });
}

exports.getTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find((item) => item.id === id);
    res
        .status(200)
        .json({
            status: 'success',
            data: {tour},
        });
};

exports.patchTour = (req, res) => {
    const body = req.body;
    res
        .status(200)
        .json({
            status: 'success',
            data: {body},
        });
};

exports.postTour = (req, res) => {
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



exports.deleteTour = (req, res) => {
    res
        .status(204)
        .json({
            status: 'success',
            data: {delete: true},
        });
};