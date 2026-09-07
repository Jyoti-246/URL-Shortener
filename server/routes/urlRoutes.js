const express = require("express");
const {
  shortenUrl,
  getAllUrls,
  deleteUrl,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/shorten", shortenUrl);

router.get("/", getAllUrls);

router.get("/test", (req, res) => {
  res.json({
    message: "URL routes are working",
  });
});

router.delete("/:id", deleteUrl);

module.exports = router;
