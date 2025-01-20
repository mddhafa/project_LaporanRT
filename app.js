const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const form = require('./routes/form-pengaduan-route');
const about = require('./routes/about-route');

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`);
    next();
});

app.get('/index', (req, res) => {
    const query = "SELECT * FROM pengaduan WHERE status_pengaduan = 'Belum Selesai'"; // Query untuk mengambil laporan yang belum selesai
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { laporan: results });  // Mengirim data laporan ke view
    });
});

// Route untuk mengubah status laporan menjadi "done"
app.post('/update-laporan-status/:NIK', (req, res) => {
    const laporanId = req.params.NIK;
    const query = "UPDATE pengaduan SET status_pengaduan = 'DONE!' WHERE NIK = ?";
    db.query(query, [laporanId], (err, results) => {
        if (err) {
            console.error('Error updating laporan status:', err);
            return res.status(500).send('Error updating status');
        }
        res.redirect('/index');  // Redirect setelah status diperbarui
    });
});

app.get('/about', (req, res) => {
    // Retrieve data from your MySQL database
    let searchQuery = req.query.nama; // get the query parameter
    let sql = "SELECT * FROM pengaduan WHERE NIK LIKE ? OR nama LIKE ?";
    let queryValues = [`%${searchQuery}%`, `%${searchQuery}%`];

    db.query(sql, queryValues, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving data from the database.");
        }

        // Pass the results to the EJS template
        res.render('about', { pengaduan: results });
    });
});


app.get('/get-pengaduan', (req, res) => {
    db.query('SELECT * FROM pengaduan', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching data');
      }
      res.json(results); // Kirimkan data sebagai JSON
    });
  });

app.use(express.static(path.join(__dirname,'src', 'views')));
app.set('view engine', 'ejs')

db.connect((eror) => {
    if (eror) {
        console.log(eror)
    } else {
        console.log("MYSQL Connected...")
    }
})

app.use('/', require('./routes/pages'));
app.use('/index', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/authadmin-routes', require('./routes/authadmin-routes'));
app.use('/form-pengaduan', form);
app.use('/about', about);
app.use('/login', require('./routes/pages'));

app.listen(5001, () => {
    console.log("server started on port 5001")
})