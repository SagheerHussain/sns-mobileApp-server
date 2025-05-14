const express = require("express");

const router = express.Router();

const {
  getProfitAndLossLists,
} = require("../controllers/profitAndLoss.controller");

// GET
router.get("/", getProfitAndLossLists);

module.exports = router;
