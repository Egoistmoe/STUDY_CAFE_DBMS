
const router = require('express').Router();
const db = require('../config/db');

// GET all roles
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM roles'
        );

        res.json(rows);

    } catch (err) {
        next(err);
    }
});

module.exports = router;
