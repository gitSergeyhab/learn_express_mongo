const fs = require('fs')
const express = require('express');

const PATH_TOUR_SIMPLE = '/dev-data/data/tours-simple.json';
const PATH_TOUR = '/dev-data/data/tours.json';

const ApiRoute = {
    Main: '/',
    Tours:  '/api/v1/tours',
}


const port = 3000;
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}${PATH_TOUR_SIMPLE}`));

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

const postTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {...req.body, id: newId};
    const newTours = [...tours, newTour];
    fs.writeFile(`${__dirname}${PATH_TOUR_SIMPLE}`, JSON.stringify(newTours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {tour: newTour},
        })
    })
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

app.route(ApiRoute.Tours)
    .get(getAllTours)
    .post(postTour)

app.route(`${ApiRoute.Tours}/:id`)
    .get(getTour)
    .patch(patchTour)
    .delete(deleteTour)

// app.get(ApiRoute.Tours, getAllTours);
// app.get(`${ApiRoute.Tours}/:id`, getTour);
// app.post(ApiRoute.Tours, postTour);
// app.patch(`${ApiRoute.Tours}/:id`, patchTour);
// app.delete(`${ApiRoute.Tours}/:id`, deleteTour);

app.listen(port, () => {
    console.log(`App listen port ${port}`)
});
