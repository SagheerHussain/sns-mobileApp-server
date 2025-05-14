const express = require("express");

const router = express.Router();

const {
    addPaymentMethod,
    getPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod,
} = require("../controllers/paymentMethod.controller");

// POST
router.post("/", addPaymentMethod);

// GET
router.get("/lists", getPaymentMethods);
router.get("/get/:id", getPaymentMethodById);

// PUT
router.put("/update/:id", updatePaymentMethod);

// DELETE
router.delete("/delete/:id", deletePaymentMethod);

module.exports = router;
