const express = require("express");
const router = express.Router();

const {
    getLeaveEntitlements,
    getLeaveEntitlementById,
    createLeaveEntitlement,
    updateLeaveEntitlement,
    deleteLeaveEntitlement,
} = require("../controllers/leaveEntitlement.controller");

// GET
router.get("/lists", getLeaveEntitlements);
router.get("/get/:id", getLeaveEntitlementById);

// POST
router.post("/", createLeaveEntitlement);

// PUT
router.put("/update/:id", updateLeaveEntitlement);

// DELETE
router.delete("/delete/:id", deleteLeaveEntitlement);

module.exports = router;