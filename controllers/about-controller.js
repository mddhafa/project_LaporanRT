require('dotenv').config();
const mysql = require('mysql');

// Buat koneksi database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE  
});

const getAboutPage = (req, res) => {
    const searchQuery = req.query.nama || ''; // Ambil parameter "nama" dari URL
    const sql = `SELECT nama FROM pengaduan WHERE nama LIKE ?`;

    // Query database
    db.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        console.log('Rendering about page with data:', { pengaduan: results });

        // Kirim data ke EJS
        res.render('about', { pengaduan: results });
    });
};

const search = (req, res) => {
    const { nama } = req.body;
    const query = `SELECT nama FROM pengaduan WHERE nama LIKE ?`;
    db.query(query, [`%${nama}%`], (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error in getting pengaduan", error: err });
        }
        res.render('about', { pengaduan: result });
    });
};

const getSearchResults = (req, res) => {
    const searchQuery = req.query.nama || ''; // Ambil parameter "nama" dari URL
    const sql = `SELECT nama FROM pengaduan WHERE nama LIKE ?`; // Query untuk pencarian

    db.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Kirim data hasil pencarian sebagai JSON
        res.json(results);
    });
};
const getUnfinishedReports = (req, res) => {
    const query = `SELECT id, nama, desk_pengaduan FROM pengaduan WHERE status_pengaduan = 'Belum Selesai'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Error in fetching unfinished reports", error: err });
        }
        // Kirim data ke template
        res.render('form-pengaduan', { reports: results });
    });
};


module.exports = {
    getAboutPage,
    search,
    getSearchResults,
    getUnfinishedReports
};