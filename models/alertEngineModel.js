
const checkReading = async (connection, readingId) => {
    const [readings] = await connection.query(
        `SELECT * FROM environment_readings
         WHERE reading_id = ?`,
        [readingId]
    );

    if (readings.length === 0) {
        return;
    }

    const reading = readings[0];

    const [thresholds] = await connection.query(
        `SELECT * FROM area_thresholds
         WHERE study_area_id = ?
         AND metric_name = ?
         AND is_active = 1`,
        [reading.study_area_id, reading.metric_name]
    );

    if (thresholds.length === 0) {
        return;
    }

    const threshold = thresholds[0];

    const belowMinimum =
        threshold.minimum_value !== null &&
        Number(reading.reading_value) < Number(threshold.minimum_value);

    const aboveMaximum =
        threshold.maximum_value !== null &&
        Number(reading.reading_value) > Number(threshold.maximum_value);

    if (!belowMinimum && !aboveMaximum) {
        return;
    }

    const [existingAlerts] = await connection.query(
        `SELECT alert_id FROM alerts
         WHERE study_area_id = ?
         AND threshold_id = ?
         AND status = 'Open'
         LIMIT 1`,
        [reading.study_area_id, threshold.threshold_id]
    );

    if (existingAlerts.length > 0) {
        return;
    }

    const [bookings] = await connection.query(
        `SELECT b.booking_id
         FROM bookings b
         JOIN seats s ON b.seat_id = s.seat_id
         WHERE s.study_area_id = ?
         AND b.status = 'Checked-In'
         AND b.start_time <= NOW()
         AND b.end_time >= NOW()
         LIMIT 1`,
        [reading.study_area_id]
    );

    const isOccupied = bookings.length > 0;

    const severity = isOccupied ? 'Medium' : 'Low';

    const message =
        `${reading.metric_name} reading is outside the allowed threshold. ` +
        `Recorded value: ${reading.reading_value}.`;

    const [alertResult] = await connection.query(
        `INSERT INTO alerts
         (study_area_id, threshold_id, severity, message, status)
         VALUES (?, ?, ?, ?, 'Open')`,
        [
            reading.study_area_id,
            threshold.threshold_id,
            severity,
            message
        ]
    );

    const alertId = alertResult.insertId;

    const taskStatus = isOccupied ? 'Pending' : 'Skipped';

    const skipReason = isOccupied
        ? null
        : 'No checked-in booking in this study area.';

    const taskDescription =
        `Check ${reading.metric_name} reading. Recorded value: ${reading.reading_value}.`;

    const [taskResult] = await connection.query(
        `INSERT INTO housekeeping_tasks
         (study_area_id, alert_id, assigned_to, task_description,
          source, status, due_at, skip_reason)
         VALUES (?, ?, NULL, ?, 'Auto', ?, NULL, ?)`,
        [
            reading.study_area_id,
            alertId,
            taskDescription,
            taskStatus,
            skipReason
        ]
    );

    await connection.query(
        `INSERT INTO audit_logs
         (user_id, action, table_name, record_id, details)
         VALUES (NULL, ?, ?, ?, ?)`,
        [
            'AUTO_CREATE',
            'alerts',
            alertId,
            `Automatically created alert from reading ID ${readingId}.`
        ]
    );

    await connection.query(
        `INSERT INTO audit_logs
         (user_id, action, table_name, record_id, details)
         VALUES (NULL, ?, ?, ?, ?)`,
        [
            'AUTO_CREATE',
            'housekeeping_tasks',
            taskResult.insertId,
            `Automatically created housekeeping task for alert ID ${alertId}.`
        ]
    );
};

module.exports = checkReading;
