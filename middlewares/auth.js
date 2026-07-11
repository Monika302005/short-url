const { getUser } = require("../service/auth");
//authentication
function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;

    req.user = null;

    if (!tokenCookie) {
        return next();
    }

    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;

    return next();
}
//authorization
function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            return res.redirect("/login");
        }

        const userRole = req.user.role || "NORMAL";
        if (!roles.includes(userRole)) {
            return res.status(403).end("UnAuthorized");
        }

        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};