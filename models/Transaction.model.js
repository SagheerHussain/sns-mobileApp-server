const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_type: { type: String, enum: ["credit", "debit"] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionCategory",
    },
    payment_method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
    paid_date: { type: Date, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    reciept_url: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
