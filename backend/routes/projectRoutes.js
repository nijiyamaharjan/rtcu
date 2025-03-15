const express = require('express');
const projectController = require('../controllers/projectController')
const teamMembersRoutes = require('./teamMembersRoutes')

const router = express.Router();

router.get('/all', projectController.getAllProjects);
router.post('/create', projectController.createProject);
router.get('/:id', projectController.getProject);
router.delete('/:id', projectController.deleteProject);
router.put('/:id', projectController.updateProject);
router.use('/:id/team', (req, res, next) => {
    req.projectId = req.params.id; // Pass the project ID explicitly
    next();
}, teamMembersRoutes);

router.get('/:id/images', projectController.getProjectImages);
router.get('/:id/attachments', projectController.getProjectAttachments);

router.delete('/images/:imageId', projectController.deleteProjectImage);
router.delete('/attachments/:attachmentId', projectController.deleteProjectAttachment);

// In projectRoutes.js - modify these routes
const upload = require('../middleware/fileUpload');

// Add these routes
router.post('/:id/images', upload.single('image'), projectController.addProjectImage);
router.post('/:id/attachments', upload.single('attachment'), projectController.addProjectAttachment);

module.exports = router;