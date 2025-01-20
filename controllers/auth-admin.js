const mysql = require("mysql");
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE  
});
exports.registerAdmin = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    // Validasi input
    if (!name || !email || !password || !passwordConfirm) {
        return res.render("register-admin", { message: "Semua field wajib diisi." });
    }

    if (password !== passwordConfirm) {
        return res.render("register-admin", { message: "Kata sandi tidak cocok." });
    }

    try {
        // Periksa apakah email sudah terdaftar
        db.query('SELECT email_admin FROM admin WHERE email_admin = ?', [email], async (error, results) => {
            if (error) {
                console.error("Error saat memeriksa email:", error);
                return res.status(500).render("register-admin", { message: "Terjadi kesalahan server." });
            }

            if (results.length > 0) {
                return res.render("register-admin", { message: "Email ini sudah terdaftar." });
            }

            // Hash password sebelum menyimpan
            const hashedPassword = await bcrypt.hash(password, 10);

            // Simpan data admin ke database
            db.query(
                'INSERT INTO admin (nama_admin, email_admin, password_admin) VALUES (?, ?, ?)', 
                [name, email, hashedPassword], 
                (err, result) => {
                    if (err) {
                        console.error("Error saat menyimpan data admin:", err);
                        return res.status(500).render("register-admin", { message: "Terjadi kesalahan server." });
                    }

                    console.log("Admin berhasil terdaftar:", result);
                    return res.render("login-admin", { message: "Pendaftaran berhasil. Silakan login." });
                }
            );
        });
    } catch (error) {
        console.error("Error saat registrasi:", error);
        return res.status(500).render("register-admin", { message: "Terjadi kesalahan server." });
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Periksa apakah email sudah terdaftar
        db.query('SELECT * FROM admin WHERE email_admin = ?', [email], async (error, results) => {
            if (error) {
                console.error("Error saat memeriksa email:", error);
                return res.status(500).render("login-admin", { message: "Terjadi kesalahan server." });
            }
            if (results.length === 0) {
                return res.render("login-admin", { message: "Email atau kata sandi salah." });
            }
            // Periksa apakah password cocok
            if (!(await bcrypt.compare(password, results[0].password_admin))) {
                return res.render("login-admin", { message: "Email atau kata sandi salah." });
            }
            // Simpan data admin ke session
            req.session.admin = results[0];
            req.session.isLoggedIn = true;
            console.log("Login berhasil:", results[0]);
            return res.redirect("/index");
            });
    }
    catch (error) {
        console.error("Error saat login:", error);
        return res.status(500).render("login-admin", { message: "Terjadi kesalahan server." });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error saat logout:", err);
            return res.redirect("/");
        }
        res.redirect("/login");
    });
};
