const express = require('express');
const router = express.Router();
const form = require('../controllers/form-pengaduan-controller');


router.get('/', form.getFormPengaduan);
router.post('/', form.addFormPengaduan);
router.put('/:NIK', form.putFormPengaduan);
router.delete('/:NIK', form.deleteFormPengaduan);


module.exports = router;