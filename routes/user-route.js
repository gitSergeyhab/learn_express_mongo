const express = require('express');

const {getAllUsers, getUser, postUser, patchUser, deleteUser} = require('../controllers/user-controller');


const userRouter = express.Router();


userRouter.route('/')
    .get(getAllUsers)
    .post(postUser);

userRouter.route('/:id')
    .get(getUser)
    .patch(patchUser)
    .delete(deleteUser);

module.exports = userRouter;