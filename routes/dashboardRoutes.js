const express = require('express');
const router = express.Router();
const Dashboard = require('../models/dashboardmodel');

router.get('/', async (req, res) => {
  try {
    const data = await Dashboard.getSummary();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;