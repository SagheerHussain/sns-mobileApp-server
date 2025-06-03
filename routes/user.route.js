const express = require("express");
const upload = require("../upload");

const router = express.Router();

const { getUserProfile, getUsersList, getSpecifiedUsers, updateProfile, deleteProfile } = require("../controllers/user.controller");

// GET
router.get("/profile", getUserProfile);
router.get("/lists", getUsersList);
router.get("/lists/specified-users", getSpecifiedUsers);

// UPDATE
router.put("/update", upload.single("profile_picture"), updateProfile);

// DELETE
router.delete("/delete/:email", deleteProfile);

module.exports = router;
