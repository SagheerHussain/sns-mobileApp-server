const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true },
    time_in: { type: Date, required: true },
    time_out: { type: Date },
    total_hours: { type: Number },
    status: { type: String, enum: ["present", "absent", "leave"], default: "absent", required: true },
    leave_type: { type: String, enum: ["monthly", "sick", "annual"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
