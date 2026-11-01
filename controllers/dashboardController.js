const Dashboard = require('../models/dashboardmodel');

exports.getReviewCountPerArea = async (req, res) => {
  try {
    const data = await Dashboard.getReviewCountPerArea();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};