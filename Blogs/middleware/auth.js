exports.auth = async (req, res, next) => {
    try {
        if (!req.session.isLoggedin) {
            console.log("To Access the Blog the user has  to Login...");
            
            res.redirect('/api/user/login');
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};