const express = require('express');
const organizationController = require('../controllers/organizationController')

const router = express.Router();

router.get('/all', organizationController.getAllOrganizations);
router.post('/create', organizationController.createOrganization);
router.get('/:id', organizationController.getOrganization);
router.delete('/:id', organizationController.deleteOrganization);
router.put('/:id', organizationController.updateOrganization);

module.exports = router;