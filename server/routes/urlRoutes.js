const express = require("express");
const { shortenUrl, getAllUrls } = require("../controllers/urlController");

const router = express.Router();

router.post("/shorten", shortenUrl);

router.get("/", getAllUrls);

router.get("/test", (req, res) => {
  res.json({
    message: "URL routes are working",
  });
});

module.exports = router;
