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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`);
    next();
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