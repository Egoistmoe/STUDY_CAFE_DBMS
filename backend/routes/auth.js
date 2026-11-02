
const router = require('express').Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// LOGIN
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const [rows] = await db.execute(
            `SELECT user_id, full_name, email, password_hash,
                    role_id, branch_id, is_active
             FROM users
             WHERE email = ?`,
            [email.trim()]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const user = rows[0];

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.is_active) {
            return res.status(403).json({
                message: 'Your account is inactive'
            });
        }

        // Do not return the password hash
        delete user.password_hash;

        res.json({
            message: 'Login successful',
            user
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
