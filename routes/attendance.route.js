const express = require("express");

const router = express.Router();

const {
  getAttendanceLists,
  getAttendanceById,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendance.controller");

// GET
router.get("/lists", getAttendanceLists);
router.get("/get/:id", getAttendanceById);

// POST
router.post("/", addAttendance);

// PUT
router.put("/update/:id", updateAttendance);

// DELETE
router.delete("/delete/:id", deleteAttendance);

module.exports = router;
