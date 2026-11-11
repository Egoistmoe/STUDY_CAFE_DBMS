const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Member = {
  async getAll() {
    const [rows] = await db.query(
      'SELECT member_id, tier_id, full_name, email, phone, total_completed_hours, created_at FROM members'
    );
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query(
      'SELECT member_id, tier_id, full_name, email, phone, total_completed_hours, created_at FROM members WHERE member_id = ?',
      [id]
    );
    return rows[0];
  },
  async create({ tier_id, full_name, email, phone, password }) {
    const hash = password ? await bcrypt.hash(password, 10) : null;
    const [result] = await db.query(
      'INSERT INTO members (tier_id, full_name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [tier_id || null, full_name, email, phone || null, hash]
    );
    return { member_id: result.insertId, full_name, email, phone: phone || null };
  },
  async update(id, { tier_id, full_name, email, phone }) {
    await db.query(
      'UPDATE members SET tier_id = ?, full_name = ?, email = ?, phone = ? WHERE member_id = ?',
      [tier_id || null, full_name, email, phone || null, id]
    );
    return { member_id: Number(id), full_name, email, phone: phone || null };
  },
  async remove(id) {
    await db.query('DELETE FROM members WHERE member_id = ?', [id]);
  }
};

module.exports = Member;