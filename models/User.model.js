const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: { type: Number, required: true },
    status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
    profile_picture: { type: String },
    isActiveEmployee: { type: Boolean, default: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1, status: 1 });
userSchema.index({ isActiveEmployee: 1 });
userSchema.index({ department: 1 });

module.exports = mongoose.model("User", userSchema);
