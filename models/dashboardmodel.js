const db = require('../config/db');

const Dashboard = {
  async getSummary() {
    const [[members]] = await db.query('SELECT COUNT(*) AS total_members FROM members');
    const [[reviews]] = await db.query(
      'SELECT COUNT(*) AS total_reviews, AVG(rating) AS avg_rating FROM feedback_reviews'
    );
    return { ...members, ...reviews };
  }
};

module.exports = Dashboard;