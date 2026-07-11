const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.render("signup", {
            error: "All fields are required.",
        });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
        });

        // Auto-login user after signup
        const token = setUser(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Signup error:", error);
        let errorMsg = "Registration failed. Please try again.";
        if (error.code === 11000) {
            errorMsg = "Email is already registered. Please LogIn instead.";
        }
        return res.render("signup", {
            error: errorMsg,
        });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", {
            error: "Email and password are required.",
        });
    }

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.render("login", {
                error: "Invalid Email or Password",
            });
        }

        const token = setUser(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Login error:", error);
        return res.render("login", {
            error: "An error occurred during login. Please try again.",
        });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};