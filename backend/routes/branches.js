
const router = require('express').Router();
const db = require('../config/db');

// GET all branches
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM branches'
        );

        res.json(rows);

    } catch (err) {
        next(err);
    }
});

module.exports = router;
