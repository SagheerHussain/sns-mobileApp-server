const Investment = require("../models/Investment.model");

/* ----------------- GET ---------------- */
const getInvestmentLists = async (req, res) => {
  try {
    const investments = await Investment.find();
    if (investments.length === 0) {
      return res
        .status(404)
        .json({ message: "Investments not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: investments,
      message: "No Investments found",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findById({ _id: id });
    if (!investment) {
      return res
        .status(404)
        .json({ message: "Investment not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: investment,
      message: "Investment retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* ----------------- POST ---------------- */
const addInvestment = async (req, res) => {
  try {
    const { organization_name, owners_id, start_date, total_amount, investment_type } = req.body;

    if (!organization_name || !owners_id || !start_date || !total_amount || !investment_type) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const investment = await Investment.create({
      organization_name,
      owners_id,
      start_date,
      total_amount,
      investment_type,
    });
    return res.status(200).json({
      success: true,
      data: investment,
      message: "Investment added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* ----------------- PUT ---------------- */
const updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      organization_name,
      owners_id,
      start_date,
      total_amount,
      investment_type,
    } = req.body;
    const investment = await Investment.findByIdAndUpdate(
      { _id: id },
      {
        organization_name,
        owners_id,
        start_date,
        total_amount,
        investment_type,
      },
      { new: true }
    );
    if (!investment) {
      return res
        .status(404)
        .json({ message: "Investment not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: investment,
      message: "Investment updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* ----------------- DELETE ---------------- */
const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findByIdAndDelete({ _id: id });
    if (!investment) {
      return res
        .status(404)
        .json({ message: "Investment not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: investment,
      message: "Investment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

module.exports = {
  getInvestmentLists,
  getInvestmentById,
  addInvestment,
  updateInvestment,
  deleteInvestment,
};
