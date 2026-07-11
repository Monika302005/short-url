const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8001;

// Trust proxy for Render/HTTPS deployment
app.set("trust proxy", true);

// Connect MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/short-url";
connectToMongoDB(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Inject baseUrl dynamically for EJS templates
app.use((req, res, next) => {
    res.locals.baseUrl = `${req.protocol}://${req.get("host")}`;
    next();
});

app.use(checkForAuthentication);

// Safe Redirection Route (Public)
app.get("/url/:shortId", async (req, res, next) => {
    const shortId = req.params.shortId;
    if (shortId === "analytics") {
        return next();
    }

    try {
        const entry = await URL.findOneAndUpdate(
            {
                shortId,
            },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        let redirectUrl = entry.redirectURL;
        // Prepend protocol if it's missing (e.g. google.com -> http://google.com)
        if (!/^https?:\/\//i.test(redirectUrl)) {
            redirectUrl = `http://${redirectUrl}`;
        }

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error("Redirection error:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRouter);

app.listen(PORT, () =>
    console.log(`Server Started at PORT:${PORT}`)
);