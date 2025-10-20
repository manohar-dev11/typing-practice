const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  grossWpm: { type: Number, required: true },
  netWpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
  keystrokeData: { type: Array, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
