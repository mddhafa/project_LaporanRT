const express = require('express');
const router = express.Router();


// Route untuk menampilkan halaman login
router.get('/index', (req, res) => {
    res.render('index', { message: null });
});

// router.get('/index', getFormPengaduan);

router.get('/login', (req, res) => {
    res.render('login', { message: null });
});

router.get('/login-admin', (req, res) => {
    res.render('login-admin', { message: null });
});

router.get('/about', (req, res) => {
    res.render('about', { message: null });
});

router.get('/form-pengaduan', (req, res) => {
    res.render('form-pengaduan', { message: null });
});

router.get('/', (req, res) => {
    res.render('welcome', { message: null });
});

module.exports = router;