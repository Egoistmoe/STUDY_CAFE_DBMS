const express = require('express');
const router = express.Router();
const FeedbackReview = require('../models/feedbackReviewModel');

router.get('/', async (req, res) => {
  try {
    const rows = await FeedbackReview.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const result = await FeedbackReview.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;