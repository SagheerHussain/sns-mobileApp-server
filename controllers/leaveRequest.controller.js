const LeaveRequest = require("../models/LeaveRequest.model");
const LeaveEntitlement = require("../models/LeaveEntitlement.model");

/* ---------------------- POST ----------------------- */
const applyLeaveRequest = async (req, res) => {
  try {
    const { user, leave_type, start_date, end_date, reason, total_days } =
      req.body;

    if (!user || !leave_type || !start_date || !end_date || !total_days) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const leaveRequest = await LeaveRequest.create({
      user,
      leave_type,
      start_date,
      end_date,
      reason,
      total_days,
      status: "pending",
    });
    return res.status(200).json({
      message: "Leave request applied successfully",
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- GET ----------------------- */
const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().lean();

    if (leaveRequests.length === 0) {
      return res.status(404).json({
        message: "Leave requests not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave requests fetched successfully",
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getLeaveRequestsByUser = async (req, res) => {
  try {
    const { user } = req.params;
    const leaveRequests = await LeaveRequest.find({ user }).lean();
    if (leaveRequests.length === 0) {
      return res.status(404).json({
        message: "Leave requests with this user not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave requests fetched successfully",
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById({ _id: id }).lean();
    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave request fetched successfully",
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- UPDATE ----------------------- */
const updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_objection } = req.body;

    if (status === "approved") {
      const leaveRequest = await LeaveRequest.findById({ _id: id });
      if (!leaveRequest) {
        return res.status(404).json({
          message: "Leave request not found",
          success: false,
        });
      }
      const leaveType = leaveRequest.leave_type;

      const leaveEnt = await LeaveEntitlement.findOne({
        user_id: leaveRequest.user,
        year: new Date().getFullYear(),
      });

      if (leaveEnt) {
        if (leaveType === "monthly") {
          leaveEnt.used_monthly_leaves += leaveRequest.total_days;
          leaveEnt.remaining_monthly_leaves -= leaveRequest.total_days;
        } else if (leaveType === "sick") {
          leaveEnt.used_sick_leaves += leaveRequest.total_days;
          leaveEnt.remaining_sick_leaves -= leaveRequest.total_days;
        } else if (leaveType === "annual") {
          leaveEnt.used_annual_leaves += leaveRequest.total_days;
          leaveEnt.remaining_annual_leaves -= leaveRequest.total_days;
        }

        await leaveEnt.save();
      }
    }
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      { _id: id },
      { status, admin_objection },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave request updated successfully",
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- DELETE ----------------------- */
const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findByIdAndDelete({ _id: id });
    if (!leaveRequest) {
      return res.status(404).json({
        message: "Leave request not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave request deleted successfully",
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  applyLeaveRequest,
  getLeaveRequests,
  getLeaveRequestsByUser,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest,
};
