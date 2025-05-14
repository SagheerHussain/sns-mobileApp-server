const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    message: { type: String, required: true },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
