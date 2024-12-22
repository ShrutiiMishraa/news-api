const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const NewsModel = require("./models/news.js");

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB Connection Error:", err));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the News API!" });
});

app.post("/api/addnews", async (req, res) => {
  try {
    const news = await NewsModel.create(req.body);
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const news = await NewsModel.find({});
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const news = await NewsModel.findById(id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const news = await NewsModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const news = await NewsModel.findByIdAndDelete(id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
