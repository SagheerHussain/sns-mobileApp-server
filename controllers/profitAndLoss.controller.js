const Project = require("../models/Project.model");
const Transactions = require("../models/Transaction.model");

/* ----------------------- GET ----------------------- */
const getProfitAndLossLists = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Build match stage dynamically
    const projectMatch = {};
    const transactionMatch = {};

    if (month && year) {
      // Match on both month and year
      const monthNum = parseInt(month); // e.g. "05" or "5" → 5
      const start = new Date(`${year}-${monthNum}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      projectMatch.lead_date = { $gte: start, $lt: end };
      transactionMatch.paid_date = { $gte: start, $lt: end };
    } else if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year) + 1}-01-01`);
      projectMatch.lead_date = { $gte: start, $lt: end };
      transactionMatch.paid_date = { $gte: start, $lt: end };
    } else if (month) {
      const currentYear = new Date().getFullYear();
      const monthNum = parseInt(month);
      const start = new Date(`${currentYear}-${monthNum}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      projectMatch.lead_date = { $gte: start, $lt: end };
      transactionMatch.paid_date = { $gte: start, $lt: end };
    }

    // Aggregate project total_cost
    const projectsCost = await Project.aggregate([
      { $match: projectMatch },
      {
        $group: {
          _id: null,
          total_cost: { $sum: "$total_cost" },
        },
      },
    ]);

    // Aggregate transaction amount
    const expenses = await Transactions.aggregate([
      { $match: transactionMatch },
      {
        $group: {
          _id: null,
          total_expenses: { $sum: "$amount" },
        },
      },
    ]);

    const total_revenue = projectsCost[0]?.total_cost || 0;
    const total_expenses = expenses[0]?.total_expenses || 0;
    const net_profit = total_revenue - total_expenses;

    const profitAndLoss = {
      total_revenue,
      total_expenses,
      net_profit,
    };

    return res.status(200).json({
      message: "Profit and Loss fetched successfully",
      success: true,
      filter_applied: { month, year },
      profitAndLoss,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getProfitAndLossLists,
};
