const express = require('express');
const teamMembersController = require('../controllers/teamMembersController')

const router = express.Router();

router.get('/all', (req, res) => {
    const projectId = req.projectId;
    teamMembersController.getAllTeamMembers(projectId, res);
});
router.get('/:memberID', (req, res) => {
    const projectId = req.projectId;
    teamMembersController.getTeamMember(projectId, req, res)
});

router.post('/add', (req, res) => {
    const projectId = req.projectId;
    teamMembersController.createTeamMember(projectId, req, res)
});

router.put('/:memberID', (req, res) => {
    const projectId = req.projectId;
    teamMembersController.updateTeamMember(projectId, req, res)
})

router.delete('/:memberID', (req, res) => {
    const projectId = req.projectId;
    teamMembersController.deleteTeamMember(projectId, req, res)
});

module.exports = router;