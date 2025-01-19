const express = require('express');
const router = express.Router();
const form = require('../controllers/form-pengaduan-controller');
function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    }
    res.redirect("/authadmin-routes/login-admin");
}

router.get('/', form.getFormPengaduan);
router.post('/', form.addFormPengaduan);
router.put('/:NIK', form.putFormPengaduan);
router.delete('/:NIK', form.deleteFormPengaduan);

router.get("/form-pengaduan", isAuthenticated, (req, res) => {
    res.render("form-pengaduan", { message: null });
});
module.exports = router;