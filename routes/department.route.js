const express = require("express");
const {
  addDepartment,
  getDepartmentsList,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department.controller");

const router = express.Router();

// GET
router.get("/lists", getDepartmentsList);
router.get("/get/:id", getDepartment);

// POST
router.post("/", addDepartment);

// PUT
router.put("/update/:id", updateDepartment);

// DELETE
router.delete("/delete/:id", deleteDepartment);

module.exports = router;
