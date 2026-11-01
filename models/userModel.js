const db = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  async create({ full_name, email, password_hash }) {
    const [[role]] = await db.query("SELECT role_id FROM roles WHERE role_name = 'Student'");
    const [result] = await db.query(
      'INSERT INTO users (role_id, full_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [role.role_id, full_name, email, password_hash]
    );
    return { user_id: result.insertId, full_name, email };
  }
};

module.exports = User;