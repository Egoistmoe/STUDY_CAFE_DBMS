const db = require('../config/db');

const FeedbackReview = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM feedback_reviews');
    return rows;
  },
  async create({ booking_id, member_id, study_area_id, rating, comment }) {
    const [result] = await db.query(
      'INSERT INTO feedback_reviews (booking_id, member_id, study_area_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [booking_id, member_id, study_area_id, rating, comment]
    );
    return { review_id: result.insertId, booking_id, member_id, study_area_id, rating, comment };
  }
};

module.exports = FeedbackReview;