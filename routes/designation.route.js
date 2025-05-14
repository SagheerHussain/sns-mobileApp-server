const express = require("express");

const router = express.Router();

// Controller
const { addDesignation, getDesignationsList, getDesignation, updateDesignation, deleteDesignation } = require("../controllers/designation.controller");

/* POST */
router.post("/", addDesignation);

/* GET */
router.get("/lists", getDesignationsList);
router.get("/get/:id", getDesignation);

/* PUT */
router.put("/update/:id", updateDesignation);

/* DELETE */
router.delete("/delete/:id", deleteDesignation);

module.exports = router;
