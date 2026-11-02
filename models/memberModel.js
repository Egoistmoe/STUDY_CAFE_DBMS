const db = require('../config/db');

const Member = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM members');
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM members WHERE member_id = ?', [id]);
    return rows[0];
  },
  async create({ tier_id, full_name, email, phone }) {
    const [result] = await db.query(
      'INSERT INTO members (tier_id, full_name, email, phone) VALUES (?, ?, ?, ?)',
      [tier_id || null, full_name, email, phone]
    );
    return { member_id: result.insertId, full_name, email, phone };
  },
  async update(id, { tier_id, full_name, email, phone }) {
    await db.query(
      'UPDATE members SET tier_id = ?, full_name = ?, email = ?, phone = ? WHERE member_id = ?',
      [tier_id || null, full_name, email, phone, id]
    );
    return { member_id: Number(id), full_name, email, phone };
  },
  async remove(id) {
    await db.query('DELETE FROM members WHERE member_id = ?', [id]);
  }
};

module.exports = Member;