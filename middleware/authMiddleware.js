const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Requires a valid token. Adds req.user = { user_id, role_id, role_name }.
exports.requireLogin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Please log in first.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
    }

    // Read the role from the database so a changed/disabled account is respected.
    const [rows] = await db.query(
      `SELECT u.user_id, u.role_id, u.is_active, r.role_name
       FROM users u
       JOIN roles r ON r.role_id = u.role_id
       WHERE u.user_id = ?`,
      [payload.user_id]
    );

    if (!rows[0] || !rows[0].is_active) {
      return res.status(401).json({ message: 'Account not found or inactive.' });
    }

    req.user = {
      user_id: rows[0].user_id,
      role_id: rows[0].role_id,
      role_name: rows[0].role_name
    };
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Use AFTER requireLogin. Example: requireRole('Admin', 'Staff')
exports.requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role_name)) {
    return res.status(403).json({ message: 'You do not have permission to do that.' });
  }
  next();
};
