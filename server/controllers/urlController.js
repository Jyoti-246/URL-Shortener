const { nanoid } = require("nanoid");
const axios = require("axios");
const Url = require("../models/Url");

const BASE_URL =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    if (!url.hostname.includes(".")) {
      return false;
    }

    if (
      url.hostname.startsWith(".") ||
      url.hostname.endsWith(".") ||
      url.hostname.includes("..")
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const shortenUrl = async (req, res) => {
  try {
    let { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    originalUrl = originalUrl.trim();

    // Add https:// if protocol is missing
    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = `https://${originalUrl}`;
    }

    // Validate URL format
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        message: "Please provide a valid URL",
      });
    }

    // Check if the actual website responds
    try {
      await axios.get(originalUrl, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      });
    } catch (error) {
      return res.status(400).json({
        message: "This website is not reachable",
      });
    }

    // Check if URL already exists
    const existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
      return res.status(200).json({
        message: "URL already shortened",
        shortUrl: `${BASE_URL}/${existingUrl.shortCode}`,
        data: existingUrl,
      });
    }

    // Generate short code
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

    const url = await Url.findOne({ shortCode });

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
