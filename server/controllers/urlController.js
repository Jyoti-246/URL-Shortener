const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const BASE_URL =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = `https://${originalUrl}`;
    }

    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({
        message: "Please provide a valid URL",
      });
    }

    const existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
      return res.status(200).json({
        message: "URL already shortened",
        shortUrl: `${BASE_URL}/${existingUrl.shortCode}`,
        data: existingUrl,
      });
    }

    const shortCode = nanoid(7);

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      message: "URL shortened successfully",
      shortUrl: `${BASE_URL}/${shortCode}`,
      data: newUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log("Received shortCode:", shortCode);

    const url = await Url.findOne({ shortCode });

    console.log("Database result:", url);

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "URLs fetched successfully",
      data: urls,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getAllUrls,
};
