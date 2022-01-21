const fs = require('fs')
const {Path} = require('../const');


const users = JSON.parse(fs.readFileSync(`${__dirname}${Path.User}`));

// USERS

exports.getAllUsers = (req, res) => {
    res
        .status(200)
        .json({
            time: req.requestTime,
            status: 'success',
            length: users.length,
            data: {users},
        });
}

exports.getUser = (req, res) => {
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

exports.postUser = (req, res) => {
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

exports.patchUser = (req, res) => {
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

exports.deleteUser = (req, res) => {
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