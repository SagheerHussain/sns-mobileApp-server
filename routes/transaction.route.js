const express = require("express");

const router = express.Router();

const {
    getTransactionsLists,
    getTransactionById,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transaction.controller");

// GET
router.get("/lists", getTransactionsLists);
router.get("/get/:id", getTransactionById);

// POST
router.post("/", addTransaction);

// PUT
router.put("/update/:id", updateTransaction);

// DELETE
router.delete("/delete/:id", deleteTransaction);

module.exports = router;
