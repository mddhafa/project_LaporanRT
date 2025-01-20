const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login)

// Route untuk menampilkan halaman login dengan pesan error
router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Contoh validasi sederhana
    if (email === 'test@example.com' && password === 'password') {
        res.redirect('/');
    } else {
        res.render('login', { message: 'Email atau password salah' });
        const express = require("express");
        const authController = require("../controllers/auth");
        
        const router = express.Router();
        
        // Route post untuk pendaftaran (register dan login) user
        router.post("/register", authController.register);
        router.post("/login", authController.login);
        
        // Route untuk menampilkan halaman login dan register (GET) user 
        router.get("/login", (req, res) => {
            res.render("login", { message: null });
        });
        router.get("/register", (req, res) => {
            res.render("register", { message: null });
        });

      
        // Route untuk logout
        router.get("/logout", (req, res) => {
           res.redirect("/login");
        });
        
    }
});

module.exports = router;