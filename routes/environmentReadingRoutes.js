
const express = require('express');
const router = express.Router();

const readingController = require('../controllers/environmentReadingController');

router.get('/', readingController.getAllReadings);
router.get('/:id', readingController.getReadingById);
router.post('/', readingController.createReading);
router.put('/:id', readingController.updateReading);
router.delete('/:id', readingController.deleteReading);

module.exports = router;
