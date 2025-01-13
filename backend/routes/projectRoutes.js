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

module.exports = router;