const express = require('express');
const expertController = require('../controllers/expertController')

const router = express.Router();

router.get('/all', expertController.getAllExperts);
router.post('/create', expertController.createExpert);
router.get('/:id', expertController.getExpert);
router.delete('/:id', expertController.deleteExpert);
router.put('/:id', expertController.updateExpert);

module.exports = router;