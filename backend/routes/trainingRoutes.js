const express = require('express');
const trainingController = require('../controllers/trainingController')

const router = express.Router();

router.get('/all', trainingController.getAllTrainings);
router.post('/create', trainingController.createTraining);
router.get('/:id', trainingController.getTraining);
router.delete('/:id', trainingController.deleteTraining);
router.put('/:id', trainingController.updateTraining);

router.get('/:id/images', trainingController.getTrainingImages);
router.get('/:id/attachments', trainingController.getTrainingAttachments);

router.delete('/images/:imageId', trainingController.deleteTrainingImage);
router.delete('/attachments/:attachmentId', trainingController.deleteTrainingAttachment);


// In trainingRoutes.js - modify these routes
const upload = require('../middleware/fileUpload');

// Add these routes
router.post('/:id/images', upload.single('image'), trainingController.addTrainingImage);
router.post('/:id/attachments', upload.single('attachment'), trainingController.addTrainingAttachment);

module.exports = router;