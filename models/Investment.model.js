const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  organization_name: { type: String },
  owners_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  start_date: { type: Date },
  total_amount: { type: Number },
  investment_type: { type: String, enum: ["loan", "savings"] },
  status: { type: String, enum: ["active", "close"], default: "active" },
});

module.exports = mongoose.model("Investment", investmentSchema);
