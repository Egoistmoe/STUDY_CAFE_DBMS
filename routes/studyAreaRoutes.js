const express = require('express');
const router = express.Router();

const studyAreaController = require('../controllers/studyAreaController');

// GET all study areas
router.get('/', studyAreaController.getAllStudyAreas);

// GET study area by ID
router.get('/:id', studyAreaController.getStudyAreaById);

// CREATE study area
router.post('/', studyAreaController.createStudyArea);

// UPDATE study area
router.put('/:id', studyAreaController.updateStudyArea);

// DELETE study area
router.delete('/:id', studyAreaController.deleteStudyArea);

module.exports = router;