const mongoose = require("mongoose");

const transactionCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("TransactionCategory", transactionCategorySchema);
