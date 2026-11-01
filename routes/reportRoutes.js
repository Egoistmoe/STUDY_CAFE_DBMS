
const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');

router.get('/study-area-reviews', reportController.getStudyAreaReviews);

module.exports = router;
