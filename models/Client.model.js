const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone_number: { type: String },
  organization: { type: String },
  type: { type: String, enum: ["individual", "corporate"], default: "individual" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
