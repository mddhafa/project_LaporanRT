const express = require("express");
const authadminController = require('../controllers/auth-admin');

const router = express.Router();


// Rute untuk registrasi admin
router.post("/register-admin", authadminController.registerAdmin);

// Rute untuk login admin
router.post("/login-admin", authadminController.loginAdmin);

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error saat logout:", err);
            return res.redirect("/index");
        }
        res.redirect("/login-admin");
    });
});

// Rute untuk menampilkan halaman login
router.get("/login-admin", (req, res) => {
    res.render("login-admin", { message: null });
});

// Rute untuk menampilkan halaman registrasi
router.get("/register-admin", (req, res) => {
    res.render("register-admin", { message: null });
});

module.exports = router;
