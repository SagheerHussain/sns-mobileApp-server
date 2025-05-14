const express = require("express");

const router = express.Router();

const {
  getTransactionCategoriesLists,
  getTransactionCategoryById,
  addTransactionCategory,
  updateTransactionCategory,
  deleteTransactionCategory,
} = require("../controllers/transactionCategory.controller");

// GET
router.get("/lists", getTransactionCategoriesLists);
router.get("/get/:id", getTransactionCategoryById);

// POST
router.post("/", addTransactionCategory);

// PUT
router.put("/:id", updateTransactionCategory);

// DELETE
router.delete("/:id", deleteTransactionCategory);

module.exports = router;
