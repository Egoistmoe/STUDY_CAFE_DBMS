const express = require('express');
const router = express.Router();
const Dashboard = require('../models/dashboardmodel');
const dashboardController = require('../controllers/dashboardController');

// Existing summary route
router.get('/', async (req, res) => {
  try {
    const data = await Dashboard.getSummary();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New review count route
router.get('/review-count-per-area', dashboardController.getReviewCountPerArea);

module.exports = router;