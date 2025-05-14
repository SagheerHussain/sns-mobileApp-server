const Holiday = require("../models/Holiday.model");

/* ---------------------- GET ----------------------- */
const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().lean();
    if (!holidays) {
      return res.status(404).json({
        message: "Holidays not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Holidays fetched successfully",
      success: true,
      data: holidays,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- GET ----------------------- */
const getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id).lean();
    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Holiday fetched successfully",
      success: true,
      data: holiday,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- POST ---------------------- */
const createHoliday = async (req, res) => {
  try {
    const { date, title } = req.body;
    if (!date || !title) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const holiday = await Holiday.create({
      date,
      title,
    });
    return res.status(200).json({
      message: "Holiday created successfully",
      success: true,
      data: holiday,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- PUT ---------------------- */
const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title } = req.body;
    const holiday = await Holiday.findByIdAndUpdate(
      { _id: id },
      {
        date,
        title,
      }
    );
    return res.status(200).json({
      message: "Holiday updated successfully",
      success: true,
      data: holiday,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------------- DELETE ---------------------- */
const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByIdAndDelete({ _id: id });
    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Holiday deleted successfully",
      success: true,
      data: holiday,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  getHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
};

