const express = require('express');
const roleController = require('../controllers/roleController');
const expertiseController = require('../controllers/expertiseController');

const router = express.Router();

// Role routes
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.get('/:id', roleController.getRole);
router.delete('/:id', roleController.deleteRole);
router.put('/:id', roleController.updateRole);


module.exports = router;
