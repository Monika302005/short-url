const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    const referer = req.get("Referer") || "/";
    const targetPath = referer.split("?")[0];

    if (!body.url) {
        return res.redirect(`${targetPath}?error=${encodeURIComponent("URL is required")}`);
    }

    try {
        const shortId = nanoid(8);

        await URL.create({
            shortId,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id,
        });

        return res.redirect(`${targetPath}?id=${shortId}`);
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.redirect(`${targetPath}?error=${encodeURIComponent("Failed to generate short URL. Please try again.")}`);
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