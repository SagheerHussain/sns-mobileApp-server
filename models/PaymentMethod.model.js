const mongoose = require("mongoose");
const slugify = require("slugify");

const paymentMethodSchema = new mongoose.Schema(
  {
    method: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

paymentMethodSchema.pre("validate", function (next) {
  if (this.method && (!this.slug || this.isModified("method"))) {
    this.slug = slugify(this.method, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
