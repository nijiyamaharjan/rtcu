const express = require('express');
const facultyController = require('../controllers/facultyController')

const router = express.Router();

router.get('/all', facultyController.getAllFaculty);
router.post('/create', facultyController.createFaculty);
router.get('/:id', facultyController.getFaculty);
router.delete('/:id', facultyController.deleteFaculty);
router.put('/:id', facultyController.updateFaculty);

module.exports = router;