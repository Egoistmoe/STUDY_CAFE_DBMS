const db = require('../config/db');

// Dates are returned as plain 'YYYY-MM-DD HH:MM:SS' text so the browser
// does not shift them by timezone.
const SELECT_ANNOUNCEMENTS = `
  SELECT a.announcement_id, a.title, a.message, a.category, a.is_active,
         DATE_FORMAT(a.published_at, '%Y-%m-%d %H:%i:%s') AS published_at,
         DATE_FORMAT(a.expires_at,   '%Y-%m-%d %H:%i:%s') AS expires_at,
         a.created_by, u.full_name AS created_by_name,
         (a.expires_at IS NOT NULL AND a.expires_at <= NOW()) AS is_expired
  FROM announcements a
  LEFT JOIN users u ON u.user_id = a.created_by
`;

// VIEW: only active, already-published, not-expired announcements
const getActive = async () => {
  const [rows] = await db.query(
    SELECT_ANNOUNCEMENTS +
    `WHERE a.is_active = 1
       AND a.published_at <= NOW()
       AND (a.expires_at IS NULL OR a.expires_at > NOW())
     ORDER BY a.published_at DESC, a.announcement_id DESC`
  );
  return rows;
};

// MANAGE: everything (active, archived, expired). Pass userId to limit to one author.
const getForManagement = async (userId = null) => {
  const [rows] = await db.query(
    SELECT_ANNOUNCEMENTS +
    (userId ? 'WHERE a.created_by = ? ' : '') +
    'ORDER BY a.published_at DESC, a.announcement_id DESC',
    userId ? [userId] : []
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    SELECT_ANNOUNCEMENTS + 'WHERE a.announcement_id = ?',
    [id]
  );
  return rows[0];
};

const create = async (data, userId) => {
  const [result] = await db.query(
    `INSERT INTO announcements
       (title, message, category, published_at, expires_at, is_active, created_by)
     VALUES (?, ?, ?, COALESCE(?, NOW()), ?, 1, ?)`,
    [data.title, data.message, data.category, data.published_at, data.expires_at, userId]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const [result] = await db.query(
    `UPDATE announcements
     SET title = ?, message = ?, category = ?,
         published_at = COALESCE(?, published_at),
         expires_at = ?, is_active = ?
     WHERE announcement_id = ?`,
    [data.title, data.message, data.category, data.published_at,
     data.expires_at, data.is_active ? 1 : 0, id]
  );
  return result.affectedRows;
};

// Archive = soft delete (keeps the record, hides it from students)
const archive = async (id) => {
  const [result] = await db.query(
    'UPDATE announcements SET is_active = 0 WHERE announcement_id = ?',
    [id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.query(
    'DELETE FROM announcements WHERE announcement_id = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = { getActive, getForManagement, getById, create, update, archive, remove };
