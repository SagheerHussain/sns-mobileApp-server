const TransactionCategory = require("../models/TransactionCategory.model");
const slugify = require("slugify");

/* ---------------------- GET --------------------- */
const getTransactionCategoriesLists = async (req, res) => {
  try {
    const transactionCategories = await TransactionCategory.find().lean();
    if (transactionCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction Categories not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transactionCategories,
      message: "No Transaction Categories found",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const getTransactionCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionCategory = await TransactionCategory.findById({ _id: id });
    if (!transactionCategory) {
      return res
        .status(404)
        .json({ message: "Transaction Category not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transactionCategory,
      message: "Transaction Category fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* ---------------------- POST --------------------- */
const addTransactionCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required", success: false });
    }

    const transactionCategory = await TransactionCategory.create({
      name,
    });
    return res.status(201).json({
      success: true,
      data: transactionCategory,
      message: "Transaction Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* ---------------------- PUT --------------------- */
const updateTransactionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required", success: false });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const transactionCategory = await TransactionCategory.findByIdAndUpdate(
      { _id: id },
      { name, slug },
      { new: true }
    );
    if (!transactionCategory) {
      return res
        .status(404)
        .json({ message: "Transaction Category not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transactionCategory,
      message: "Transaction Category updated successfully",
    });
  } catch (error) {
    console.error("Error saving client:", error);
    return res.status(500).json({
      message: "Error saving client",
      error: error.message,
      success: false,
    });
  }
};

/* ---------------------- DELETE --------------------- */
const deleteTransactionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionCategory = await TransactionCategory.findByIdAndDelete({
      _id: id,
    });
    if (!transactionCategory) {
      return res
        .status(404)
        .json({ message: "Transaction Category not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transactionCategory,
      message: "Transaction Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

module.exports = {
  getTransactionCategoriesLists,
  getTransactionCategoryById,
  addTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
};
