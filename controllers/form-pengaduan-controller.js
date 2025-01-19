require('dotenv').config();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE  
}); 

const getFormPengaduan = (req, res) => {
    const query = `SELECT * FROM pengaduan`;
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send({message: "Error in getting all pengaduan", error: err});
        }
        res.render('form-pengaduan', { pengaduan: result });
    });
};

const addFormPengaduan = (req, res) => {
    const { NIK, nama, alamat, no_hp, jns_pengaduan, desk_pengaduan } = req.body;

    const query = `INSERT INTO pengaduan (NIK, nama, alamat, no_hp, jns_pengaduan, desk_pengaduan, status_pengaduan) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [NIK, nama, alamat, no_hp, jns_pengaduan, desk_pengaduan, 'Belum Selesai'], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Error in adding pengaduan", error: err });
        }
        res.redirect('/form-pengaduan');
    });
};

const getFormPengaduanIndex = (_req, res) => {
    const query = `SELECT * FROM pengaduan`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Error in getting pengaduan", error: err });
        }
        // Kirim data ke view
        console.log('Results fetched:', results);
        res.render('index', { tampil: results || [] });
    });
};


const putFormPengaduan = (req, res) => {
    const { NIK } = req.params;
    const { nama, alamat, no_hp, jns_pengaduan, desk_pengaduan, status_pengaduan } = req.body;
    const query = `UPDATE pengaduan SET nama = ?, alamat = ?, no_hp = ?, jns_pengaduan = ?, desk_pengaduan = ?, status_pengaduan = ? WHERE NIK = ?`;
    db.query(query, [nama, alamat, no_hp, jns_pengaduan, desk_pengaduan, status_pengaduan, NIK], (err, result) => {
        if (err) {
            res.status(500).send({message: "Error in updating pengaduan", error: err});
        }
        res.redirect('/form-pengaduan');
    });
};

const deleteFormPengaduan = (req, res) => {
    const { NIK } = req.params;
    const query = `DELETE FROM pengaduan WHERE NIK = ?`;
    db.query(query, [NIK], (err, result) => {
        if(err) {
            res.status(500).send({message: "Error in deleting pengaduan", error: err});
        }
        res.redirect('/form-pengaduan');
    });
}

module.exports = {
    getFormPengaduan,
    addFormPengaduan,
    putFormPengaduan,
    deleteFormPengaduan,
    getFormPengaduanIndex
};
