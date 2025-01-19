const express = require('express');
const router = express.Router();
const form = require('../controllers/form-pengaduan-controller');

router.get('/index', form.getFormPengaduanIndex);

module.exports = router;