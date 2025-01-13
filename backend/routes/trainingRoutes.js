const express = require('express');
const trainingController = require('../controllers/trainingController')

const router = express.Router();

router.get('/all', trainingController.getAllTrainings);
router.post('/create', trainingController.createTraining);
router.get('/:id', trainingController.getTraining);
router.delete('/:id', trainingController.deleteTraining);
router.put('/:id', trainingController.updateTraining);

module.exports = router;