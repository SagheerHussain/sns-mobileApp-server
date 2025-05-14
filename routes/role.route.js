const express = require("express");

const router = express.Router();

const { getRolesList, getRole, addRole, updateRole, deleteRole } = require("../controllers/role.controller");

// GET
router.get("/lists", getRolesList);
router.get("/get/:id", getRole);

// POST
router.post("/", addRole);

// PUT
router.put("/update/:id", updateRole);

// DELETE
router.delete("/delete/:id", deleteRole);

module.exports = router;