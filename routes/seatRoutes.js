const express = require('express');
const router = express.Router();

const seatController = require('../controllers/seatController');

// GET ALL SEATS
router.get('/', seatController.getAllSeats);

// GET SEATS WITHOUT ACTIVE BOOKINGS
router.get('/available-report', seatController.getSeatsWithoutActiveBookings);

// GET SEAT BY ID
router.get('/:id', seatController.getSeatById);

// CREATE SEAT
router.post('/', seatController.createSeat);

// UPDATE SEAT
router.put('/:id', seatController.updateSeat);

// DELETE SEAT
router.delete('/:id', seatController.deleteSeat);

module.exports = router;