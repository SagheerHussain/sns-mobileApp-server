const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String, required: true },
    total_cost: { type: Number, required: true },
    deadline: { type: Date, required: true },
    lead_date: { type: Date, required: true },
    assign_users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    priority: { type: String, enum: ["low", "high", "urgent"], required: true },
    stage: {
      type: String,
      enum: ["designing", "development", "testing", "deployment", "live"],
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "hold_on", "cancelled"],
      default: "hold_on"
    },
    progress_percentage: { type: Number, default: 0 },
    tags: [String],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
