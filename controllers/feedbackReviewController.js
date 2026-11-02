const FeedbackReview = require('../models/feedbackReviewModel');

exports.getAll = async (req, res) => {
  try {
    res.json(await FeedbackReview.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await FeedbackReview.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};