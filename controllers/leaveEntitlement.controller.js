const LeaveEntitlement = require("../models/LeaveEntitlement.model");

/* ---------------------- GET ----------------------- */
const getLeaveEntitlements = async (req, res) => {
  try {
    const leaveEntitlements = await LeaveEntitlement.find().lean();
    if (leaveEntitlements.length === 0) {
      return res.status(404).json({
        message: "Leave entitlements not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave entitlements fetched successfully",
      success: true,
      data: leaveEntitlements,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getLeaveEntitlementById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveEntitlement = await LeaveEntitlement.findById({
      _id: id,
    }).lean();
    if (!leaveEntitlement) {
      return res.status(404).json({
        message: "Leave entitlement not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave entitlement fetched successfully",
      success: true,
      data: leaveEntitlement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- POST ----------------------- */
const createLeaveEntitlement = async (req, res) => {
  try {
    const {
      user_id,
      year,
      total_annual_leaves,
      total_sick_leaves,
      total_monthly_leaves,
      used_annual_leaves,
      used_sick_leaves,
      used_monthly_leaves,
      remaining_annual_leaves,
      remaining_sick_leaves,
      remaining_monthly_leaves,
    } = req.body;

    if (
      !user_id ||
      !year ||
      !total_annual_leaves ||
      !total_sick_leaves ||
      !total_monthly_leaves ||
      !used_annual_leaves ||
      !used_sick_leaves ||
      !used_monthly_leaves ||
      !remaining_annual_leaves ||
      !remaining_sick_leaves ||
      !remaining_monthly_leaves
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingLeaveEntitlement = await LeaveEntitlement.findOne({
      user_id,
      year,
    });

    if (existingLeaveEntitlement) {
      return res.status(400).json({
        message: "Leave entitlement already exists",
        success: false,
      });
    }

    const leaveEntitlement = await LeaveEntitlement.create({
      user_id,
      year,
      total_annual_leaves,
      total_sick_leaves,
      total_monthly_leaves,
      used_annual_leaves,
      used_sick_leaves,
      used_monthly_leaves,
      remaining_annual_leaves,
      remaining_sick_leaves,
      remaining_monthly_leaves,
    });
    return res.status(200).json({
      message: "Leave entitlement created successfully",
      success: true,
      data: leaveEntitlement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- PUT ----------------------- */
const updateLeaveEntitlement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      year,
      total_annual_leaves,
      total_sick_leaves,
      total_monthly_leaves,
      used_annual_leaves,
      used_sick_leaves,
      used_monthly_leaves,
      remaining_annual_leaves,
      remaining_sick_leaves,
      remaining_monthly_leaves,
    } = req.body;
    const leaveEntitlement = await LeaveEntitlement.findByIdAndUpdate(
      id,
      {
        user_id,
        year,
        total_annual_leaves,
        total_sick_leaves,
        total_monthly_leaves,
        used_annual_leaves,
        used_sick_leaves,
        used_monthly_leaves,
        remaining_annual_leaves,
        remaining_sick_leaves,
        remaining_monthly_leaves,
      },
      { new: true }
    );
    if (!leaveEntitlement) {
      return res.status(404).json({
        message: "Leave entitlement not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave entitlement updated successfully",
      success: true,
      data: leaveEntitlement,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- DELETE ----------------------- */
const deleteLeaveEntitlement = async (req, res) => {
  try {
    const leaveEntitlement = await LeaveEntitlement.findByIdAndDelete(
      req.params.id
    );
    if (!leaveEntitlement) {
      return res.status(404).json({
        message: "Leave entitlement not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Leave entitlement deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  getLeaveEntitlements,
  getLeaveEntitlementById,
  createLeaveEntitlement,
  updateLeaveEntitlement,
  deleteLeaveEntitlement,
};
