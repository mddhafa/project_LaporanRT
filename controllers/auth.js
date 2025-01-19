const mysql = require("mysql");
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE  
}); 

exports.register = (req, res) => {
    console.log(req.body);

    const {name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM user WHERE email = ?', [email], async(error, result) =>{
        if (error){
            console.log(error);
        } 
        if( result.length > 0){
            return res.render('register',{
                message: 'Email ini sudah terdaftar'
            })
        } else if (password !== passwordConfirm){
            return res.render('register',{
                message: 'passwornya beda bro'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8); 
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', {name: name , email: email, password: hashedPassword}, (eror, result)  => {
            if (error) {
                console.log(error);
            }else{
                console.log(result);
                return res.render('register',{
                    message: 'User terdaftar'
                });
            }
        })

    });


};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cek apakah email dan password telah diisi
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Harap isi email dan password'
            });
        }

        // Query untuk mencari user berdasarkan email
        db.query('SELECT * FROM user WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
            }

            // Jika tidak ditemukan user atau password tidak cocok
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('login', {
                    message: 'Email atau password salah'
                });
            }

            res.status(200).redirect('/index');
        });
    } catch (error) {
        console.log(error);
    }
};


