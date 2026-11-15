const db = require('../config/db');

const Booking = {
    async getAllBookings() {
        const [rows] = await db.query(`
            SELECT
                b.booking_id,
                b.member_id,
                b.seat_id,
                b.start_time,
                b.end_time,
                b.status,
                b.total_price,
                b.created_at
            FROM bookings b
            ORDER BY b.created_at DESC
        `);

        return rows;
    },

    async getBookingById(booking_id) {
        const [rows] = await db.query(
            'SELECT * FROM bookings WHERE booking_id = ?',
            [booking_id]
        );

        return rows[0];
    }
};

module.exports = Booking;
