const Attendance = require("../models/Attendance.model");
const Holiday = require("../models/Holiday.model");
const User = require("../models/User.model");
const LeaveRequest = require("../models/LeaveRequest.model");

/* ---------------------- GET ----------------------- */
const getAttendanceLists = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const attendances = await Attendance.find()
      .select("user date marked_in marked_out total_hours status")
      .populate("user")
      .skip(skip)
      .limit(limit)
      .lean();
    if (attendances.length === 0) {
      return res.status(404).json({
        message: "Attendance not found",
        success: false,
      });
    }

    const total = await Attendance.countDocuments();

    return res.status(200).json({
      message: "Attendance fetched successfully",
      success: true,
      data: attendances,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById({ _id: id }).lean();
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Attendance fetched successfully",
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getAttendanceByUser = async (req, res) => {
  try {
    const { user } = req.params;
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;
    const attendances = await Attendance.find({ user })
      .select("user date marked_in marked_out total_hours status")
      .populate("user")
      .skip(skip)
      .limit(limit)
      .lean();
    if (attendances.length === 0) {
      return res.status(404).json({
        message: "Attendance not found",
        success: false,
      });
    }
    const total = await Attendance.countDocuments({ user });
    return res.status(200).json({
      message: "Attendance fetched successfully",
      success: true,
      data: attendances,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const markAutoAbsentOrLeaveHandler = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isHoliday = await Holiday.findOne({ date: today });
  const day = today.getDay();

  if (isHoliday || day === 0 || day === 6) {
    console.log("It's a holiday or weekend. Skipping auto-absent.");
    return;
  }

  const users = await User.find();

  for (const user of users) {
    try {
      const alreadyMarked = await Attendance.findOne({
        user: user._id,
        date: today,
      });
      if (alreadyMarked) continue;

      const approvedLeave = await LeaveRequest.findOne({
        user: user._id,
        status: "approved",
        start_date: { $lte: today },
        end_date: { $gte: today },
      });

      if (approvedLeave) {
        const leaveType = approvedLeave.leave_type;

        await Attendance.create({
          user: user._id,
          date: today,
          status: "leave",
          total_hours: 0,
          leave_type: leaveType,
        });
      } else {
        await Attendance.create({
          user: user._id,
          date: today,
          status: "absent",
          total_hours: 0,
        });
      }
    } catch (err) {
      console.error(`❌ Error processing user ${user._id}:`, err.message);
    }
  }

  console.log("✅ Auto absent marking complete.");
};

/* ---------------------- POST ----------------------- */
const addAttendance = async (req, res) => {
  try {
    const { user, time_in, date } = req.body;

    const attendance = await Attendance.create({
      user,
      date,
      time_in: new Date(time_in),
    });

    return res.status(200).json({
      message: "Attendance marked successfully",
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", success: false, error: error.message });
  }
};

/* ---------------------- PUT ----------------------- */
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, time_out, date } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Attendance not found", success: false });
    }

    attendance.time_out = new Date(time_out);

    // Calculate total_hours
    const timeIn = new Date(attendance.time_in);
    const timeOut = new Date(attendance.time_out);
    const totalMs = timeOut - timeIn;
    const totalHours = +(totalMs / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
    attendance.total_hours = totalHours;

    await attendance.save();

    res.status(200).json({
      message: "Attendance updated with time out",
      success: true,
      data: attendance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error", success: false, error: error.message });
  }
};

/* ---------------------- DELETE ----------------------- */
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Attendance deleted successfully",
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  getAttendanceLists,
  getAttendanceById,
  getAttendanceByUser,
  markAutoAbsentOrLeaveHandler,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};
