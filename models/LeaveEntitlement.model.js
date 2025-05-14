const mongoose = require("mongoose");

const leaveEntitlementSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  year: { type: Number, required: true },
  total_annual_leaves: { type: Number, required: true },
  total_sick_leaves: { type: Number, required: true },
  total_monthly_leaves: { type: Number, required: true },
  used_annual_leaves: { type: Number, required: true },
  used_sick_leaves: { type: Number, required: true },
  used_monthly_leaves: { type: Number, required: true },
  remaining_annual_leaves: { type: Number, required: true },
  remaining_sick_leaves: { type: Number, required: true },
  remaining_monthly_leaves: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("LeaveEntitlement", leaveEntitlementSchema);
