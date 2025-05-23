const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Currency", currencySchema);
