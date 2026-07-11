const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL= require('./models/url');
const path=require("path");
const cookieParser=require("cookie-parser");
const {checkForAuthentication,restrictTo,} = require("./middlewares/auth");
const staticRouter = require("./routes/staticRouter");
const userRoute=require('./routes/user');

const app = express();
const PORT = process.env.PORT || 8001;

// Connect MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/short-url";
connectToMongoDB(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

    app.set("view engine","ejs");
    app.set('views',path.resolve('./views'));

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
app.use(checkForAuthentication);


// Routes
app.use("/url", restrictTo(["NORMAL","ADMIN"]), urlRoute);

app.use("/user",userRoute);

app.use("/",staticRouter);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

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

    res.redirect(entry.redirectURL);
});

app.listen(PORT, () =>
    console.log(`Server Started at PORT:${PORT}`)
);