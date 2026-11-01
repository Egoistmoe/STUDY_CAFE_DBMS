const Report = require('../models/reportModel');

exports.getStudyAreaReviews = async (req, res) => {
    try {
        const rows = await Report.getStudyAreaReviews();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};