const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  method: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
