const express = require('express');

const {
  getAllTours,
  getTour,
  postTour,
  patchTour,
  deleteTour,
  aliasTopTours,
  getTorStats,
  getMonthlyPlan,
} = require('../controllers/tour-controller');

const { protect } = require('../controllers/auth-controller');

const router = express.Router();

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/stats-1').get(getTorStats);

router.route('/').get(protect, getAllTours).post(postTour);

router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;
