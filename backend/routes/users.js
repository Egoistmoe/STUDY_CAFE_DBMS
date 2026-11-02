
const router = require('express').Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// READ: Get all users
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.is_active,
                u.created_at,
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

// REPORT: Users with Role and Branch (INNER JOIN)
router.get('/report', async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                r.role_name,
                b.branch_name
            FROM users u
            INNER JOIN roles r
                ON r.role_id = u.role_id
            INNER JOIN branches b
                ON b.branch_id = u.branch_id
            ORDER BY u.user_id
        `);

        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// READ: Get one user by ID
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.role_id,
                u.branch_id,
                u.is_active,
                u.created_at,
                r.role_name,
                b.branch_name
            FROM users u
            INNER JOIN roles r ON r.role_id = u.role_id
            LEFT JOIN branches b ON b.branch_id = u.branch_id
            WHERE u.user_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// CREATE: Add a new user
router.post('/', async (req, res, next) => {
    try {
        const {
            role_id,
            branch_id,
            full_name,
            email,
            password,
            is_active = true
        } = req.body;

        if (!role_id || !full_name || !email || !password) {
            return res.status(400).json({
                message: 'role_id, full_name, email, and password are required'
            });
        }

        if (!Number.isInteger(Number(role_id)) ||
            (branch_id != null && branch_id !== '' &&
             !Number.isInteger(Number(branch_id)))) {
            return res.status(400).json({
                message: 'role_id and branch_id must be valid IDs'
            });
        }

        if (typeof full_name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !full_name.trim() ||
            !email.trim() ||
            password.length < 8) {
            return res.status(400).json({
                message: 'Enter a valid name and email. Password must be at least 8 characters.'
            });
        }

        if (![true, false, 1, 0].includes(is_active)) {
            return res.status(400).json({
                message: 'is_active must be true or false'
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await db.execute(`
            INSERT INTO users
                (role_id, branch_id, full_name, email, password_hash, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            Number(role_id),
            branch_id === '' || branch_id == null ? null : Number(branch_id),
            full_name.trim(),
            email.trim(),
            password_hash,
            is_active ? 1 : 0
        ]);

        res.status(201).json({
            message: 'User created successfully',
            user_id: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }
        next(err);
    }
});

// UPDATE: Edit an existing user
router.put('/:id', async (req, res, next) => {
    try {
        const {
            role_id,
            branch_id,
            full_name,
            email,
            password,
            is_active
        } = req.body;

        const fields = [];
        const values = [];

        if (role_id !== undefined) {
            if (!Number.isInteger(Number(role_id)) || Number(role_id) <= 0) {
                return res.status(400).json({
                    message: 'Invalid role_id'
                });
            }
            fields.push('role_id = ?');
            values.push(Number(role_id));
        }

        if (branch_id !== undefined) {
            if (branch_id !== null && branch_id !== '' &&
                (!Number.isInteger(Number(branch_id)) || Number(branch_id) <= 0)) {
                return res.status(400).json({
                    message: 'Invalid branch_id'
                });
            }
            fields.push('branch_id = ?');
            values.push(branch_id === '' || branch_id === null
                ? null : Number(branch_id));
        }

        if (full_name !== undefined) {
            if (typeof full_name !== 'string' || !full_name.trim()) {
                return res.status(400).json({
                    message: 'Invalid full_name'
                });
            }
            fields.push('full_name = ?');
            values.push(full_name.trim());
        }

        if (email !== undefined) {
            if (typeof email !== 'string' || !email.trim()) {
                return res.status(400).json({
                    message: 'Invalid email'
                });
            }
            fields.push('email = ?');
            values.push(email.trim());
        }

        if (password !== undefined) {
            if (typeof password !== 'string' || password.length < 8) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters'
                });
            }
            fields.push('password_hash = ?');
            values.push(await bcrypt.hash(password, 10));
        }

        if (is_active !== undefined) {
            if (![true, false, 1, 0].includes(is_active)) {
                return res.status(400).json({
                    message: 'is_active must be true or false'
                });
            }
            fields.push('is_active = ?');
            values.push(is_active ? 1 : 0);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: 'No valid fields provided for update'
            });
        }

        values.push(req.params.id);

        const [result] = await db.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'User updated successfully'
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }
        next(err);
    }
});

// DELETE: Remove a user
router.delete('/:id', async (req, res, next) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM users WHERE user_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'User deleted successfully'
        });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                message: 'Cannot delete this user because other records reference this account.'
            });
        }
        next(err);
    }
});

module.exports = router;
