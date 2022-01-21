const fs = require('fs')
const express = require('express');
const { use } = require('express/lib/application');

const Path = {
    TourSimple: '/dev-data/data/tours-simple.json',
    User: '/dev-data/data/users.json',
    Tour: '/dev-data/data/tours.json'
};

const ApiRoute = {
    Main: '/',
    Tours:  '/api/v1/tours',
    Users: '/api/v1/users'
};


const port = 3000;
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}${Path.TourSimple}`));
const users = JSON.parse(fs.readFileSync(`${__dirname}${Path.User}`));

const tourRouter = express.Router();
const userRouter = express.Router();

app.use(ApiRoute.Tours, tourRouter);
app.use(ApiRoute.Users, userRouter);

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


// USERS

const getAllUsers = (req, res) => {
    res
        .status(200)
        .json({
            time: req.requestTime,
            status: 'success',
            length: users.length,
            data: {users},
        });
}

const getUser = (req, res) => {
    const id = req.params.id;
    const user = users.find((item) => item._id === id);
    if (!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no user with ID :  ${id}`
        })
    }
    res
        .status(200)
        .json({
            status: 'success',
            data: {user},
        });
};

const postUser = (req, res) => {
    const newId = users[users.length - 1].id + '1';
    const newUser = {...req.body, id: newId};
    const newUsers = [...users, newUser];
    fs.writeFile(`${__dirname}${Path.User}`, JSON.stringify(newUsers), (err) => {
        res.status(201).json({
            status: 'success',
            data: {user: newUser},
        })
    })
};

const patchUser = (req, res) => {
    const id = req.params.id;
    const user = users.find((item) => item._id === id);
    if (!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no user with ID :  ${id}`
        })
    }
    res
        .status(200)
        .json({
            status: 'success',
            data: {user},
        });
};

const deleteUser = (req, res) => {
    const id = req.params.id;
    const user = users.find((item) => item._id === id);
    if (!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: `there is no user with ID :  ${id}`
        })
    }
    res
        .status(204)
        .json({
            status: 'success',
            data: {delete: true},
        });
};

tourRouter.route('/')
    .get(getAllTours)
    .post(postTour)

tourRouter.route('/:id')
    .get(getTour)
    .patch(patchTour)
    .delete(deleteTour)

// app.get(ApiRoute.Tours, getAllTours);
// app.get(`${ApiRoute.Tours}/:id`, getTour);
// app.post(ApiRoute.Tours, postTour);
// app.patch(`${ApiRoute.Tours}/:id`, patchTour);
// app.delete(`${ApiRoute.Tours}/:id`, deleteTour);
userRouter.route('/')
    .get(getAllUsers)
    .post(postUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(patchUser)
    .delete(deleteUser)

app.listen(port, () => {
    console.log(`App listen port ${port}`)
});
