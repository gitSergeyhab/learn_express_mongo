const express = require('express');
const { signup } = require('../controllers/auth-controller');

const {
  getAllUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', signup);

router.route('/').get(getAllUsers).post(postUser);

router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;
