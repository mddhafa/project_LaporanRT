
const halogin = (req, res) => {
    res.render('login', { message: null });
}

const loginadmin = (req, res) => {
    res.render('login_admin', { message: null });
}

module.exports = {
    halogin,
    loginadmin
};