const express = require("express");
const router = express.Router();

const { getHolidays, getHolidayById, createHoliday, updateHoliday, deleteHoliday } = require("../controllers/holiday.controller");

// GET
router.get("/lists", getHolidays);
router.get("/get/:id", getHolidayById);

// POST
router.post("/", createHoliday);

// PUT
router.put("/update/:id", updateHoliday);

// DELETE
router.delete("/delete/:id", deleteHoliday);

module.exports = router;