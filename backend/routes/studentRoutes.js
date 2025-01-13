const express = require('express');
const studentController = require('../controllers/studentController')

const router = express.Router();

router.get('/all', studentController.getAllStudents);
router.post('/create', studentController.createStudent);
router.get('/:id', studentController.getStudent);
router.delete('/:id', studentController.deleteStudent);
router.put('/:id', studentController.updateStudent);

module.exports = router;