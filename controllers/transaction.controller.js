const Transaction = require("../models/Transaction.model");

/* --------------------- GET --------------------- */
const getTransactionsLists = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("category payment_method").lean();
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "Transactions not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transactions,
      message: "Transactions lists found",
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

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById({ _id: id }).populate("category payment_method").lean();
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transaction,
      message: "Transaction retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const filteredTransactions = async (req, res) => {
  try {
    const { title, transaction_type, month, year, category } = req.query;

    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (transaction_type) {
      query.transaction_type = transaction_type;
    }
    if (month) {
      query.month = month;
    }
    if (year) {
      query.year = year;
    }
    if (category) {
      query.category = category;
    }

    const transactions = await Transaction.find(query).populate("sender_id category payment_method").lean();
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "Transactions not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transactions,
      message: "No Transactions found",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* --------------------- POST --------------------- */
const addTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      transaction_type,
      category,
      payment_method,
      paid_date,
      month,
      year,
      reciept_url,
      sender,
    } = req.body;

    if (
      !title ||
      !amount ||
      !transaction_type ||
      !category ||
      !payment_method ||
      !paid_date ||
      !month ||
      !year ||
      !sender
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const transaction = await Transaction.create({
      title,
      amount,
      transaction_type,
      category,
      payment_method,
      paid_date,
      month,
      year,
      reciept_url: reciept_url ? reciept_url : "",
      sender,
    });

    return res.status(201).json({
      success: true,
      data: transaction,
      message: "Transaction created successfully",
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

/* --------------------- PUT --------------------- */
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      amount,
      transaction_type,
      category,
      payment_method,
      paid_date,
      reciept_url,
      user,
    } = req.body;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = parseInt(paid_date.split("-")[1], 10) - 1;
    const year = parseInt(paid_date.split("-")[0]);
    const month = months[monthIndex];

    const transaction = await Transaction.findByIdAndUpdate(
      { _id: id },
      {
        title,
        amount,
        transaction_type,
        category,
        payment_method,
        paid_date,
        month,
        year,
        reciept_url,
        user,
      },
      { new: true }
    );
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transaction,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* --------------------- DELETE --------------------- */
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete({ _id: id });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: transaction,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

module.exports = {
  getTransactionsLists,
  getTransactionById,
  filteredTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
