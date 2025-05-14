const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ["admin", "employee"], required: true, default: "employee" },
    permissions: [
      {
        module: { type: String, required: true },
        actions: [{ type: String, enum: ["create", "read", "update", "delete"] }],
      },
    ],
  },
  { timestamps: true }
);

roleSchema.index({ name: 1 });
roleSchema.index({ "permissions.module": 1 });

module.exports = mongoose.model("Role", roleSchema);
