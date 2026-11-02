const db = require('../config/db');

const Dashboard = {
  async getSummary() {
    const [[members]] = await db.query(
      'SELECT COUNT(*) AS total_members FROM members'
    );

    const [[reviews]] = await db.query(
      'SELECT COUNT(*) AS total_reviews, AVG(rating) AS avg_rating FROM feedback_reviews'
    );

    return { ...members, ...reviews };
  },

  async getReviewCountPerArea() {
    const [rows] = await db.query(`
      SELECT
        sa.study_area_id,
        sa.area_name,
        COUNT(fr.review_id) AS review_count
      FROM study_areas sa
      LEFT JOIN feedback_reviews fr
        ON sa.study_area_id = fr.study_area_id
      GROUP BY sa.study_area_id, sa.area_name
      ORDER BY review_count DESC
    `);

    return rows;
  }
};

module.exports = Dashboard;