const Booking = require('../models/bookingsModel');

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAllBookings();

        res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error('Error retrieving bookings:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to retrieve bookings'
        });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.getBookingById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error retrieving booking:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to retrieve booking'
        });
    }
};
