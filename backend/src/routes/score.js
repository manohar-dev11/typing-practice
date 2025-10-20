const express = require("express");
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Submit typing session
router.post("/", auth, async (req, res) => {
  const { grossWpm, netWpm, accuracy, errors, keystrokeData } = req.body;
  try {
    const session = await Session.create({
      userId: req.user.id,
      grossWpm,
      netWpm,
      accuracy,
      errors,
      keystrokeData
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to save session", error: err.message });
  }
});

module.exports = router;
