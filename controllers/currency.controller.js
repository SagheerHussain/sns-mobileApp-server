const Currency = require("../models/Currency.model");

/* ------------------ GET ------------------ */
const getCurrencyLists = async (req, res) => {
  try {
    const currencies = await Currency.find().lean();
    if (!currencies.length == 0) {
      return res
        .status(404)
        .json({ message: "Currencies not found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Currencies retrieved successfully",
        success: true,
        data: currencies,
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const getCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById({ _id: id }).lean();
    if (!currency) {
      return res
        .status(404)
        .json({ message: "Currency not found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Currency retrieved successfully",
        success: true,
        data: currency,
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ------------------ POST ------------------ */
const addCurrency = async (req, res) => {
  try {
    const { name, symbol } = req.body;
    if (!name || !symbol) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }
    const currency = await Currency.create({ name, symbol });
    return res
      .status(200)
      .json({
        message: "Currency added successfully",
        success: true,
        data: currency,
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ------------------ PUT ------------------ */
const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, symbol } = req.body;
    const currency = await Currency.findByIdAndUpdate(
      { _id: id },
      { name, symbol }
    );
    if (!currency) {
      return res
        .status(404)
        .json({ message: "Currency not found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Currency updated successfully",
        success: true,
        data: currency,
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ------------------ DELETE ------------------ */
const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByIdAndDelete({ _id: id });
    if (!currency) {
      return res
        .status(404)
        .json({ message: "Currency not found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Currency deleted successfully",
        success: true,
        data: currency,
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = {
  getCurrencyLists,
  getCurrency,
  addCurrency,
  updateCurrency,
  deleteCurrency,
};
