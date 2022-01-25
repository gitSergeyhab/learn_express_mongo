const express = require('express');

const {
  getAllTours,
  getTour,
  postTour,
  patchTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tour-controller');

const router = express.Router();

// router.param('id', checkID);
router.route('/top-5-chip').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(postTour);

router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;
