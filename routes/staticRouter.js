const express = require("express");
const { restrictTo } = require("../middlewares/auth");
const URL = require("../models/url");

const router = express.Router();

// Admin can see all URLs
router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
    const allurls = await URL.find({}).populate("createdBy");

    return res.render("home", {
        urls: allurls,
        id: req.query.id,
        error: req.query.error,
        isAdmin: true,
        user: req.user,
    });
});

// Normal user can see only their URLs
router.get("/", restrictTo(["NORMAL","ADMIN"]), async (req, res) => {
    const allurls = await URL.find({
        createdBy: req.user._id,
    });

    return res.render("home", {
        urls: allurls,
        id: req.query.id,
        error: req.query.error,
        isAdmin: req.user.role === "ADMIN",
        user: req.user,
    });
});

router.get("/signup", (req, res) => {
    if (req.cookies?.token) {
        return res.redirect("/");
    }
    return res.render("signup");
});

router.get("/login", (req, res) => {
    if (req.cookies?.token) {
        return res.redirect("/");
    }
    return res.render("login");
});

module.exports = router;