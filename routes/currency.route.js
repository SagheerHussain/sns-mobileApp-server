const express = require("express");

const router = express.Router();

const { getCurrencyLists, getCurrency, addCurrency, updateCurrency, deleteCurrency } = require("../controllers/currency.controller");

// GET
router.get("/lists", getCurrencyLists);
router.get("/get/:id", getCurrency);

// POST
router.post("/", addCurrency);

// PUT
router.put("/update/:id", updateCurrency);

// DELETE
router.delete("/delete/:id", deleteCurrency);

module.exports = router;

