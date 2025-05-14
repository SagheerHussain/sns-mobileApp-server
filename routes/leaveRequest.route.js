const express = require("express");
const router = express.Router();

const {
    applyLeaveRequest,
    getLeaveRequests,
    getLeaveRequestsByUser,
    getLeaveRequestById,
    updateLeaveRequest,
    deleteLeaveRequest,
} = require("../controllers/leaveRequest.controller");

// GET
router.get("/lists", getLeaveRequests);
router.get("/user/:user", getLeaveRequestsByUser);
router.get("/get/:id", getLeaveRequestById);

// POST
router.post("/", applyLeaveRequest);

// PUT
router.put("/update/:id", updateLeaveRequest);

// DELETE
router.delete("/delete/:id", deleteLeaveRequest);

module.exports = router;

