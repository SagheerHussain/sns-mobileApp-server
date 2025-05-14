const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leave_type: { type: String, enum: ["monthly", "sick", "annual"], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  total_days: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  admin_objection: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);