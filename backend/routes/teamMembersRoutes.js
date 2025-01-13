const express = require('express');
const teamMembersController = require('../controllers/teamMembersController')

const router = express.Router();

router.get('/all', (req, res) => {
    const projectId = req.projectId;
    teamMembersController.getAllTeamMembers(projectId, res);
});
router.get('/:memberID', teamMembersController.getTeamMember);
router.post('/add', teamMembersController.createTeamMember);
router.put('/:memberID', teamMembersController.updateTeamMember);
router.delete('/:memberID', teamMembersController.deleteTeamMember);

module.exports = router;