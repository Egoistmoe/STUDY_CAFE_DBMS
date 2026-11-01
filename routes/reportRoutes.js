const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/reading-coverage', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                sa.study_area_id,
                sa.area_name,
                COUNT(er.reading_id) AS total_readings,
                CASE
                    WHEN COUNT(er.reading_id) = 0
                    THEN 'No Reading Data'
                    ELSE 'Has Reading Data'
                END AS coverage_status
            FROM study_areas sa
            LEFT JOIN environment_readings er
                ON sa.study_area_id = er.study_area_id
            GROUP BY
                sa.study_area_id,
                sa.area_name

            UNION

            SELECT
                sa.study_area_id,
                sa.area_name,
                COUNT(er.reading_id) AS total_readings,
                'No Reading Data' AS coverage_status
            FROM environment_readings er
            RIGHT JOIN study_areas sa
                ON er.study_area_id = sa.study_area_id
            GROUP BY
                sa.study_area_id,
                sa.area_name
            HAVING COUNT(er.reading_id) = 0
        `);

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;