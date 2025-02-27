exports.auth = async (req, res, next) => {
    try {
        if (!req.session.isLoggedin) {
            res.redirect('/api/user/login');
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};