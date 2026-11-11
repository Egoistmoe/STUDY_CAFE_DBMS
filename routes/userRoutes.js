const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../config/db');

const SELECT_USERS = `
  SELECT u.user_id, u.full_name, u.email, u.role_id, u.branch_id, u.is_active,
         r.role_name, b.branch_name
  FROM users u
  LEFT JOIN roles r ON r.role_id = u.role_id
  LEFT JOIN branches b ON b.branch_id = u.branch_id
`;

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(SELECT_USERS + ' ORDER BY u.user_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(SELECT_USERS + ' WHERE u.user_id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { full_name, email, password, role_id, branch_id, is_active } = req.body;
    if (!full_name || !email || !password || !role_id)
      return res.status(400).json({ message: 'Name, email, password and role are required.' });

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (role_id, branch_id, full_name, email, password_hash, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [role_id, branch_id || null, full_name, email, hash, is_active ? 1 : 0]
    );
    res.status(201).json({ message: 'User added successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { full_name, email, password, role_id, branch_id, is_active } = req.body;
    await db.query(
      'UPDATE users SET role_id = ?, branch_id = ?, full_name = ?, email = ?, is_active = ? WHERE user_id = ?',
      [role_id, branch_id || null, full_name, email, is_active ? 1 : 0, req.params.id]
    );
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hash, req.params.id]);
    }
    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;