const mongoose = require("mongoose");
const slugify = require("slugify");

const transactionCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

transactionCategorySchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("TransactionCategory", transactionCategorySchema);
