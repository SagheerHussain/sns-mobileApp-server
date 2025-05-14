const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    details: { type: String, required: true },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assign_users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    stage: {
      type: String,
      enum: ["development", "designing", "testing", "live"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      required: true,
    },
    priority: { type: String, enum: ["high", "low", "urgent"], required: true },
    due_date: { type: Date, required: true },
    completedAt: { type: Date },
    document: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    progress_percentage: { type: Number, default: 0 },
    tags: [String],
    edit_task_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
