const fs = require('fs')
const express = require('express');
const {Path} = require('../const');


const users = JSON.parse(fs.readFileSync(`${__dirname}${Path.User}`));

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

const userRouter = express.Router();


userRouter.route('/')
    .get(getAllUsers)
    .post(postUser);

userRouter.route('/:id')
    .get(getUser)
    .patch(patchUser)
    .delete(deleteUser);

module.exports = userRouter;