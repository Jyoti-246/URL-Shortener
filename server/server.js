const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

console.log("MONGO_URI exists:", !!process.env.MONGO_URL);

const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/urls", urlRoutes);

app.get("/:shortCode", redirectUrl);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "URL Shortner API is running",
  });
});
