
const db = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async create({ full_name, email, password_hash }) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [[role]] = await connection.query(
        "SELECT role_id FROM roles WHERE role_name = 'Student'"
      );

      if (!role) {
        throw new Error('Student role not found');
      }

      const [userResult] = await connection.query(
        `INSERT INTO users (role_id, full_name, email, password_hash)
         VALUES (?, ?, ?, ?)`,
        [role.role_id, full_name, email, password_hash]
      );

      const [memberResult] = await connection.query(
        `INSERT INTO members (user_id, full_name, email)
         VALUES (?, ?, ?)`,
        [userResult.insertId, full_name, email]
      );

      await connection.commit();

      return {
        user_id: userResult.insertId,
        member_id: memberResult.insertId,
        full_name,
        email
      };

    } catch (err) {
      await connection.rollback();
      throw err;

    } finally {
      connection.release();
    }
  }
};

module.exports = User;
