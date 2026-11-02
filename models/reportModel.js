const db = require('../config/db');

const Report = {
    async getStudyAreaReviews() {
        const [rows] = await db.query(`
            SELECT
                sa.study_area_id,
                sa.area_name,
                COUNT(fr.review_id) AS review_count,
                ROUND(AVG(fr.rating), 2) AS avg_rating
            FROM feedback_reviews fr
            RIGHT JOIN study_areas sa
                ON fr.study_area_id = sa.study_area_id
            GROUP BY sa.study_area_id, sa.area_name
            ORDER BY review_count DESC
        `);

        return rows;
    }
};

module.exports = Report;