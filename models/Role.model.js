const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
      default: "employee",
      trim: true,
      lowercase: true, // normalize
    },
    permissions: [
      {
        module: {
          type: String,
          required: true,
          trim: true,
        },
        actions: [
          {
            type: String,
            enum: ["create", "read-all", "read-self", "update", "delete"],
            required: true,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Indexes for faster queries
roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ "permissions.module": 1 });

module.exports = mongoose.model("Role", roleSchema);
