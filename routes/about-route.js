const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about-controller'); 
// Route pencarian (API)
router.get('/api/search', aboutController.getSearchResults);
router.post('/about', aboutController.search);

// Route halaman
router.get('/about', aboutController.getAboutPage);

module.exports = router;
