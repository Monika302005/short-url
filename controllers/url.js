const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        const allUrls = await URL.find({ createdBy: req.user._id });
        return res.status(400).render("home", {
            error: "URL is required",
            urls: allUrls,
        });
    }

    try {
        const shortId = nanoid(8);

        await URL.create({
            shortId,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id,
        });

        const allUrls = await URL.find({ createdBy: req.user._id });

        return res.render("home", {
            id: shortId,
            urls: allUrls,
        });
    } catch (error) {
        console.error("Error creating short URL:", error);
        const allUrls = await URL.find({ createdBy: req.user._id });
        return res.status(500).render("home", {
            error: "Failed to generate short URL. Please try again.",
            urls: allUrls,
        });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    try {
        const result = await URL.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};