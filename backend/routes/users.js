
const router = require('express').Router();
const db = require('../config/db');

router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                r.role_name,
                b.branch_name
            FROM users u
            INNER JOIN roles r ON r.role_id = u.role_id
            LEFT JOIN branches b ON b.branch_id = u.branch_id
            ORDER BY u.user_id
        `);

        res.json(rows);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
