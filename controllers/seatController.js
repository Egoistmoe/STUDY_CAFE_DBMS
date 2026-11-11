const seatModel = require('../models/seatModel');

// GET ALL SEATS
exports.getAllSeats = async (req, res) => {
    try {
        const seats = await seatModel.getAllSeats();
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SEAT BY ID
exports.getSeatById = async (req, res) => {
    try {
        const seat = await seatModel.getSeatById(req.params.id);

        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        res.status(200).json(seat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE SEAT
exports.createSeat = async (req, res) => {
    try {
        const id = await seatModel.createSeat(req.body);

        res.status(201).json({
            message: 'Seat created successfully',
            seat_id: id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE SEAT
exports.updateSeat = async (req, res) => {
    try {
        const updated = await seatModel.updateSeat(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        res.status(200).json({ message: 'Seat updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE SEAT
exports.deleteSeat = async (req, res) => {
    try {
        const deleted = await seatModel.deleteSeat(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        res.status(200).json({ message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SEATS WITHOUT ACTIVE BOOKINGS
exports.getSeatsWithoutActiveBookings = async (req, res) => {
    try {
        const seats = await seatModel.getSeatsWithoutActiveBookings();
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};