const express = require('express');
const expertiseController = require('../controllers/expertiseController');

const router = express.Router();

// Expertise routes

router.get('/', expertiseController.getAllExpertise);
router.post('/', expertiseController.createExpertise);
router.get('/:id', expertiseController.getExpertise);
router.delete('/:id', expertiseController.deleteExpertise);
router.put('/:id', expertiseController.updateExpertise);

module.exports = router;