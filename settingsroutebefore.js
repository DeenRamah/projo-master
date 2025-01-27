const express = require('express');
const settingsController = require('../controllers/settingsController');
const router = express.Router();

router.post('/create', settingsController.create);
router.post('/edit', settingsController.edit);
router.post('/view', settingsController.view);
router.post('/delete', settingsController.delete);
router.post('/viewAll', settingsController.viewAll);
router.get('/viewSettings', settingsController.viewSettings);

module.exports = router;
