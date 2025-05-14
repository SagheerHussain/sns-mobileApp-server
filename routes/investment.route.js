const express = require("express");
const router = express.Router();

const {
  getInvestmentLists,
  getInvestmentById,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} = require("../controllers/investment.controller");

// GET
router.get("/lists", getInvestmentLists);
router.get("/get/:id", getInvestmentById);

// POST
router.post("/", addInvestment);

// PUT
router.put("/update/:id", updateInvestment);

// DELETE
router.delete("/delete/:id", deleteInvestment);

module.exports = router;
